#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'cywf';
const REPO_NAME = 'AlphaNest';

interface Discussion {
  title: string;
  author: string;
  url: string;
  createdAt: string;
  category: string;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'AlphaNest-Site',
    ...(options.headers as Record<string, string>),
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function fetchDiscussions(): Promise<Discussion[]> {
  console.log('Fetching discussions...');
  
  // GraphQL query to fetch discussions
  const query = `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        discussions(first: 25, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            title
            author {
              login
            }
            url
            createdAt
            category {
              name
            }
          }
        }
      }
    }
  `;
  
  try {
    const data = await fetchWithAuth('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query,
        variables: {
          owner: REPO_OWNER,
          name: REPO_NAME,
        },
      }),
    });
    
    if (data.data?.repository?.discussions?.nodes) {
      const discussions: Discussion[] = data.data.repository.discussions.nodes.map((node: any) => ({
        title: node.title,
        author: node.author?.login || 'Unknown',
        url: node.url,
        createdAt: node.createdAt,
        category: node.category?.name || 'General',
      }));
      
      console.log(`✅ Fetched ${discussions.length} discussions`);
      return discussions;
    }
    
    throw new Error('No discussions data in response');
  } catch (error) {
    console.error('Error fetching discussions:', error);
    console.log('Using fallback data');
    
    // Fallback data
    return [
      {
        title: 'Welcome to AlphaNest Discussions!',
        author: 'cywf',
        url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/discussions`,
        createdAt: new Date().toISOString(),
        category: 'Announcements',
      },
    ];
  }
}

async function main() {
  try {
    const discussions = await fetchDiscussions();
    
    // Ensure output directory exists
    const outputDir = join(__dirname, '..', 'public', 'data');
    mkdirSync(outputDir, { recursive: true });
    
    // Write discussions to file
    const outputPath = join(outputDir, 'discussions.json');
    writeFileSync(outputPath, JSON.stringify(discussions, null, 2));
    
    console.log(`✅ Discussions written to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error fetching discussions:', error);
    process.exit(1);
  }
}

main();
