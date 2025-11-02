#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'cywf';
const REPO_NAME = 'AlphaNest';

interface ProjectItem {
  title: string;
  status: string;
  labels: string[];
  assignees: string[];
  url: string;
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

async function fetchProjectsV2(): Promise<ProjectItem[]> {
  console.log('Attempting to fetch Projects v2 data...');
  
  // GraphQL query for Projects v2
  const query = `
    query($owner: String!) {
      user(login: $owner) {
        projectsV2(first: 5, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            title
            items(first: 100) {
              nodes {
                content {
                  ... on Issue {
                    title
                    url
                    labels(first: 10) {
                      nodes {
                        name
                      }
                    }
                    assignees(first: 5) {
                      nodes {
                        login
                      }
                    }
                  }
                  ... on PullRequest {
                    title
                    url
                  }
                }
                fieldValues(first: 10) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
                        }
                      }
                    }
                  }
                }
              }
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
        variables: { owner: REPO_OWNER },
      }),
    });
    
    if (data.data?.user?.projectsV2?.nodes?.[0]?.items?.nodes) {
      const items = data.data.user.projectsV2.nodes[0].items.nodes;
      
      const projectItems: ProjectItem[] = items
        .filter((item: any) => item.content?.title)
        .map((item: any) => {
          // Find status field
          let status = 'todo';
          if (item.fieldValues?.nodes) {
            const statusField = item.fieldValues.nodes.find(
              (fv: any) => fv.field?.name === 'Status'
            );
            if (statusField?.name) {
              status = statusField.name.toLowerCase().includes('progress') ? 'doing' : 
                      statusField.name.toLowerCase().includes('done') ? 'done' : 'todo';
            }
          }
          
          return {
            title: item.content.title,
            status,
            labels: item.content.labels?.nodes?.map((l: any) => l.name) || [],
            assignees: item.content.assignees?.nodes?.map((a: any) => a.login) || [],
            url: item.content.url,
          };
        });
      
      console.log(`✅ Fetched ${projectItems.length} items from Projects v2`);
      return projectItems;
    }
    
    throw new Error('No Projects v2 data available');
  } catch (error) {
    console.error('Projects v2 not accessible:', error);
    console.log('Falling back to issues grouped by status labels...');
    return fetchIssuesByStatusLabels();
  }
}

async function fetchIssuesByStatusLabels(): Promise<ProjectItem[]> {
  console.log('Fetching open issues grouped by status labels...');
  
  try {
    const issues = await fetchWithAuth(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&per_page=100`
    );
    
    const projectItems: ProjectItem[] = issues.map((issue: any) => {
      // Determine status from labels
      let status = 'todo';
      const labelNames = issue.labels.map((l: any) => l.name);
      
      if (labelNames.some((l: string) => l.toLowerCase().includes('doing') || l.toLowerCase().includes('progress'))) {
        status = 'doing';
      } else if (labelNames.some((l: string) => l.toLowerCase().includes('done') || l.toLowerCase().includes('complete'))) {
        status = 'done';
      }
      
      return {
        title: issue.title,
        status,
        labels: labelNames,
        assignees: issue.assignees?.map((a: any) => a.login) || [],
        url: issue.html_url,
      };
    });
    
    console.log(`✅ Fetched ${projectItems.length} issues`);
    return projectItems;
  } catch (error) {
    console.error('Error fetching issues:', error);
    
    // Fallback data
    return [
      {
        title: 'Example: Setup CI/CD Pipeline',
        status: 'done',
        labels: ['enhancement', 'devops'],
        assignees: ['cywf'],
        url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues`,
      },
      {
        title: 'Example: Implement Trading Strategy',
        status: 'doing',
        labels: ['feature', 'trading'],
        assignees: [],
        url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues`,
      },
      {
        title: 'Example: Add Documentation',
        status: 'todo',
        labels: ['documentation'],
        assignees: [],
        url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues`,
      },
    ];
  }
}

async function main() {
  try {
    const projectItems = await fetchProjectsV2();
    
    // Ensure output directory exists
    const outputDir = join(__dirname, '..', 'public', 'data');
    mkdirSync(outputDir, { recursive: true });
    
    // Write project items to file
    const outputPath = join(outputDir, 'projects.json');
    writeFileSync(outputPath, JSON.stringify(projectItems, null, 2));
    
    console.log(`✅ Project data written to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error fetching project data:', error);
    process.exit(1);
  }
}

main();
