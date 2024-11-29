import { Octokit } from "octokit";

interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  issuesPerPage: number;
}

// 缓存接口
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheStore {
  issues: Map<string, CacheItem<GitHubIssue[]>>;
  singleIssue: Map<number, CacheItem<GitHubIssue>>;
  labels: CacheItem<GitHubLabel[]> | null;
}

// 缓存配置
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
const LABELS_CACHE_DURATION = 30 * 60 * 1000; // 标签缓存30分钟，因为变动较少

const cache: CacheStore = {
  issues: new Map(),
  singleIssue: new Map(),
  labels: null,
};

// 生成缓存键
function getCacheKey(page: number, labels?: string): string {
  return `${page}-${labels || 'all'}`;
}

// 检查缓存是否有效
function isCacheValid(cache: CacheItem<any>, duration: number = CACHE_DURATION) {
  return Date.now() - cache.timestamp < duration;
}

let config: GitHubConfig | null = null;

export function setGitHubConfig(newConfig: GitHubConfig) {
  config = newConfig;
  // 当配置改变时，清除所有缓存
  cache.issues.clear();
  cache.singleIssue.clear();
  cache.labels = null;
  localStorage.setItem('github-config', JSON.stringify(newConfig));
}

export const getGitHubConfig = (forApi: boolean = true): GitHubConfig => {
  // API 调用时优先使用环境变量
  if (forApi) {
    const envConfig = {
      owner: process.env.NEXT_PUBLIC_GITHUB_OWNER,
      repo: process.env.NEXT_PUBLIC_GITHUB_REPO,
      token: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    };

    if (envConfig.owner && envConfig.repo && envConfig.token) {
      return {
        owner: envConfig.owner,
        repo: envConfig.repo,
        token: envConfig.token,
        issuesPerPage: 10
      };
    }
  }

  // 其次使用运行时配置
  if (config) {
    return config;
  }

  // 最后尝试从 localStorage 读取
  if (typeof window !== 'undefined') {
    const savedConfig = localStorage.getItem('github-config');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      config = parsedConfig;
      return parsedConfig;
    }
  }

  // 如果都没有，返回空配置
  return {
    owner: '',
    repo: '',
    token: '',
    issuesPerPage: 10
  };
};

export async function getIssues(page: number = 1, labels?: string) {
  const cacheKey = getCacheKey(page, labels);
  const cachedData = cache.issues.get(cacheKey);

  if (cachedData && isCacheValid(cachedData)) {
    return cachedData.data;
  }

  const config = getGitHubConfig();
  const octokit = new Octokit({
    auth: config.token
  });

  const { data } = await octokit.rest.issues.listForRepo({
    owner: config.owner,
    repo: config.repo,
    state: 'all',
    per_page: config.issuesPerPage,
    page,
    sort: 'created',
    direction: 'desc',
    labels: labels || undefined
  });

  // 更新缓存
  cache.issues.set(cacheKey, {
    data,
    timestamp: Date.now()
  });

  return data;
}

interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

interface GitHubCache<T> {
  data: T;
  timestamp: number;
}

interface GitHubIssue {
  number: number;
  title: string;
  body: string | null;
  created_at: string;
  state: string;
  labels: GitHubLabel[];
}

export async function getIssue(issueNumber: number) {
  // 检查缓存
  const cachedIssue = cache.singleIssue.get(issueNumber);
  if (cachedIssue && isCacheValid(cachedIssue)) {
    return cachedIssue.data;
  }

  const config = getGitHubConfig();
  const octokit = new Octokit({
    auth: config.token
  });

  const { data } = await octokit.rest.issues.get({
    owner: config.owner,
    repo: config.repo,
    issue_number: issueNumber
  });

  const issueData: GitHubIssue = {
    number: data.number,
    title: data.title,
    body: data.body || '',
    created_at: data.created_at,
    state: data.state,
    labels: data.labels.map((label: { id: number; name: string; color: string; description: string | null }) => ({
      id: label.id,
      name: label.name,
      color: label.color,
      description: label.description,
    })),
  };

  // 更新缓存
  cache.singleIssue.set(issueNumber, {
    data: issueData,
    timestamp: Date.now()
  });

  return issueData;
}

export async function createIssue(title: string, body: string, labels: string[] = []) {
  const config = getGitHubConfig();
  const octokit = new Octokit({
    auth: config.token
  });

  const { data } = await octokit.rest.issues.create({
    owner: config.owner,
    repo: config.repo,
    title,
    body,
    labels
  });

  // 清除 issues 列表缓存，因为有新的 issue 创建
  cache.issues.clear();

  return data;
}

export async function updateIssue(issueNumber: number, title: string, body: string, labels: string[] = []) {
  const config = getGitHubConfig();
  const octokit = new Octokit({
    auth: config.token
  });

  const { data } = await octokit.rest.issues.update({
    owner: config.owner,
    repo: config.repo,
    issue_number: issueNumber,
    title,
    body,
    labels
  });

  // 清除相关缓存
  cache.singleIssue.delete(issueNumber);
  cache.issues.clear();

  return data;
}

export async function getLabels() {
  // 检查标签缓存
  if (cache.labels && isCacheValid(cache.labels, LABELS_CACHE_DURATION)) {
    return cache.labels.data;
  }

  const config = getGitHubConfig();
  const octokit = new Octokit({
    auth: config.token
  });

  const { data } = await octokit.rest.issues.listLabelsForRepo({
    owner: config.owner,
    repo: config.repo,
  });

  // 更新缓存
  cache.labels = {
    data,
    timestamp: Date.now()
  };

  return data;
}

export async function createLabel(name: string, color: string, description?: string) {
  const config = getGitHubConfig();
  const octokit = new Octokit({
    auth: config.token
  });

  const { data } = await octokit.rest.issues.createLabel({
    owner: config.owner,
    repo: config.repo,
    name,
    color,
    description
  });

  // 清除标签缓存
  cache.labels = null;

  return data;
}

// 创建一个全局的 Octokit 实例
export const octokit = new Octokit({
  auth: getGitHubConfig().token,
});