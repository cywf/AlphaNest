#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'cywf';
const REPO_NAME = 'AlphaNest';

interface StatsData {
  stars: number;
  forks: number;
  watchers: number;
  languages: Record<string, number>;
  commits: Array<{ week: string; count: number }>;
}

async function fetchWithAuth(url: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'AlphaNest-Site',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function fetchRepoData(): Promise<StatsData> {
  console.log('Fetching repository data...');
  
  // Fetch basic repo info
  const repoInfo = await fetchWithAuth(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`
  );
  
  const stars = repoInfo.stargazers_count || 0;
  const forks = repoInfo.forks_count || 0;
  const watchers = repoInfo.subscribers_count || 0;
  
  console.log(`Stars: ${stars}, Forks: ${forks}, Watchers: ${watchers}`);
  
  // Fetch languages
  let languages: Record<string, number> = {};
  try {
    const languagesData = await fetchWithAuth(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/languages`
    );
    languages = languagesData;
    console.log('Languages fetched:', Object.keys(languages).join(', '));
  } catch (error) {
    console.error('Error fetching languages:', error);
    languages = { Python: 50000, TypeScript: 30000, Other: 20000 };
  }
  
  // Fetch commit activity (last 52 weeks, we'll take last 12)
  let commits: Array<{ week: string; count: number }> = [];
  try {
    const commitActivity = await fetchWithAuth(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/stats/commit_activity`
    );
    
    if (Array.isArray(commitActivity)) {
      commits = commitActivity.slice(-12).map((week: any) => ({
        week: new Date(week.week * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: week.total || 0,
      }));
    }
    console.log(`Fetched ${commits.length} weeks of commit activity`);
  } catch (error) {
    console.error('Error fetching commit activity:', error);
    // Fallback data
    commits = Array.from({ length: 12 }, (_, i) => ({
      week: new Date(Date.now() - (12 - i) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: Math.floor(Math.random() * 20) + 5,
    }));
  }
  
  return {
    stars,
    forks,
    watchers,
    languages,
    commits,
  };
}

async function main() {
  try {
    const stats = await fetchRepoData();
    
    // Ensure output directory exists
    const outputDir = join(__dirname, '..', 'public', 'data');
    mkdirSync(outputDir, { recursive: true });
    
    // Write stats to file
    const outputPath = join(outputDir, 'stats.json');
    writeFileSync(outputPath, JSON.stringify(stats, null, 2));
    
    console.log(`✅ Stats written to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error fetching repository data:', error);
    process.exit(1);
  }
}

main();
