import { Octokit } from "octokit";

interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  issuesPerPage: number;
}

let config: GitHubConfig | null = null;

export function setGitHubConfig(newConfig: GitHubConfig) {
  config = newConfig;
  localStorage.setItem('github-config', JSON.stringify(newConfig));
}

export async function getIssues(page: number = 1) {
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
    direction: 'desc'
  });

  return data;
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

export const fetchGitHubAPI = async (endpoint: string, options: RequestInit = {}) => {
  const config = getGitHubConfig();
  
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${config.token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response.json();
};

export const octokit = new Octokit({
  auth: getGitHubConfig().token,
});

export async function createIssue(title: string, body: string, labels: string[] = []) {
  try {
    const response = await octokit.rest.issues.create({
      owner: getGitHubConfig().owner,
      repo: getGitHubConfig().repo,
      title,
      body,
      labels,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
}

export async function updateIssue(issueNumber: number, title: string, body: string, labels: string[] = []) {
  try {
    const response = await octokit.rest.issues.update({
      owner: getGitHubConfig().owner,
      repo: getGitHubConfig().repo,
      issue_number: issueNumber,
      title,
      body,
      labels,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating issue:", error);
    throw error;
  }
}

export async function getLabels() {
  try {
    const response = await octokit.rest.issues.listLabelsForRepo({
      owner: getGitHubConfig().owner,
      repo: getGitHubConfig().repo,
      per_page: 100,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching labels:", error);
    throw error;
  }
}

export async function createLabel(name: string, color: string, description?: string) {
  try {
    const response = await octokit.rest.issues.createLabel({
      owner: getGitHubConfig().owner,
      repo: getGitHubConfig().repo,
      name,
      color: color.replace('#', ''),
      description,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating label:", error);
    throw error;
  }
} 