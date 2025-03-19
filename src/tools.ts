import { Octokit } from "octokit";

// Initialize Octokit (will use environment variables for authentication)
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Tools for GitHub API
export const tools = {
  "search-repos": {
    name: "search-repos",
    description: "Search for GitHub repositories",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
        sort: {
          type: "string",
          enum: ["stars", "forks", "help-wanted-issues", "updated"],
          description: "Sort order",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return",
        }
      },
      required: ["query"],
    },
  },
  "get-repo-info": {
    name: "get-repo-info",
    description: "Get information about a specific GitHub repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner (username or organization)",
        },
        repo: {
          type: "string",
          description: "Repository name",
        }
      },
      required: ["owner", "repo"],
    },
  },
  "list-issues": {
    name: "list-issues",
    description: "List issues in a GitHub repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner (username or organization)",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        state: {
          type: "string",
          enum: ["open", "closed", "all"],
          description: "Issue state",
        },
        limit: {
          type: "number",
          description: "Maximum number of issues to return",
        }
      },
      required: ["owner", "repo"],
    },
  },
  "create-issue": {
    name: "create-issue",
    description: "Create a new issue in a GitHub repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner (username or organization)",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        title: {
          type: "string",
          description: "Issue title",
        },
        body: {
          type: "string",
          description: "Issue body",
        },
        labels: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Labels to apply to the issue",
        }
      },
      required: ["owner", "repo", "title", "body"],
    },
  },
};

// Type definitions for tool parameters
type SearchReposArgs = {
  query: string;
  sort?: "stars" | "forks" | "help-wanted-issues" | "updated";
  limit?: number;
};

type GetRepoInfoArgs = {
  owner: string;
  repo: string;
};

type ListIssuesArgs = {
  owner: string;
  repo: string;
  state?: "open" | "closed" | "all";
  limit?: number;
};

type CreateIssueArgs = {
  owner: string;
  repo: string;
  title: string;
  body: string;
  labels?: string[];
};

// Tool handler implementations
const searchRepos = async (args: SearchReposArgs) => {
  const { query, sort = "stars", limit = 5 } = args;
  
  try {
    const response = await octokit.rest.search.repos({
      q: query,
      sort,
      per_page: limit,
    });
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            response.data.items.map(repo => ({
              name: repo.full_name,
              description: repo.description,
              stars: repo.stargazers_count,
              url: repo.html_url,
              language: repo.language,
              forks: repo.forks_count,
            })),
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: "text",
          text: `Error searching repositories: ${errorMessage}`,
        },
      ],
    };
  }
};

const getRepoInfo = async (args: GetRepoInfoArgs) => {
  const { owner, repo } = args;
  
  try {
    const response = await octokit.rest.repos.get({
      owner,
      repo,
    });
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              name: response.data.full_name,
              description: response.data.description,
              stars: response.data.stargazers_count,
              forks: response.data.forks_count,
              issues: response.data.open_issues_count,
              language: response.data.language,
              created_at: response.data.created_at,
              updated_at: response.data.updated_at,
              url: response.data.html_url,
              default_branch: response.data.default_branch,
              license: response.data.license?.name || "No license",
              topics: response.data.topics,
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: "text",
          text: `Error getting repository information: ${errorMessage}`,
        },
      ],
    };
  }
};

const listIssues = async (args: ListIssuesArgs) => {
  const { owner, repo, state = "open", limit = 10 } = args;
  
  try {
    const response = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state,
      per_page: limit,
    });
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            response.data.map(issue => ({
              number: issue.number,
              title: issue.title,
              state: issue.state,
              created_at: issue.created_at,
              updated_at: issue.updated_at,
              user: issue.user?.login,
              labels: issue.labels.map(label => 
                typeof label === 'string' ? label : label.name
              ),
              url: issue.html_url,
              comments: issue.comments,
            })),
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: "text",
          text: `Error listing issues: ${errorMessage}`,
        },
      ],
    };
  }
};

const createIssue = async (args: CreateIssueArgs) => {
  const { owner, repo, title, body, labels = [] } = args;
  
  try {
    const response = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
    });
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              number: response.data.number,
              title: response.data.title,
              url: response.data.html_url,
              created_at: response.data.created_at,
              message: "Issue created successfully",
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: "text",
          text: `Error creating issue: ${errorMessage}`,
        },
      ],
    };
  }
};

// Export tool handlers
export const toolHandlers = {
  "search-repos": searchRepos,
  "get-repo-info": getRepoInfo,
  "list-issues": listIssues,
  "create-issue": createIssue,
};