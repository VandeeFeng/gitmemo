export interface Label {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

export interface Issue {
  number: number;
  title: string;
  body: string | null;
  created_at: string;
  state: string;
  labels: Label[];
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  issuesPerPage: number;
} 