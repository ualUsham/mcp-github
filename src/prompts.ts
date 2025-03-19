export const prompts = {
    "create-issue-description": {
      name: "create-issue-description",
      description: "Generate a description for a GitHub issue",
      arguments: [
        {
          name: "title",
          description: "Title of the issue",
          required: true,
        },
        {
          name: "type",
          description: "Type of issue (bug, feature, documentation, etc.)",
          required: true,
        },
        {
          name: "details",
          description: "Additional details about the issue",
          required: true,
        }
      ]
    },
    "create-pull-request-description": {
      name: "create-pull-request-description",
      description: "Generate a description for a GitHub pull request",
      arguments: [
        {
          name: "title",
          description: "Title of the pull request",
          required: true,
        },
        {
          name: "changes",
          description: "List of changes made in the pull request",
          required: true,
        },
        {
          name: "relatedIssue",
          description: "Related issue number, if any",
        }
      ]
    },
    "search-repos-prompt": {
      name: "search-repos-prompt",
      description: "Generate a query for searching GitHub repositories",
      arguments: [
        {
          name: "description",
          description: "Description of the repositories you're looking for",
          required: true,
        },
        {
          name: "language",
          description: "Programming language of the repositories",
        },
        {
          name: "stars",
          description: "Minimum number of stars (e.g., '1000')",
        }
      ]
    },
    "create-issue-prompt": {
      name: "create-issue-prompt",
      description: "Generate parameters for creating a GitHub issue",
      arguments: [
        {
          name: "description",
          description: "Description of the issue you want to create",
          required: true,
        },
        {
          name: "repositoryContext",
          description: "Context about the repository (e.g., what the project is about)",
          required: true,
        }
      ]
    },
    "enhance-github-response": {
      name: "enhance-github-response",
      description: "Format and enhance raw GitHub API response data",
      arguments: [
        {
          name: "responseData",
          description: "Raw JSON response data from GitHub API",
          required: true,
        },
        {
          name: "responseType",
          description: "Type of response (repos, issues, etc.)",
          required: true,
        }
      ]
    }
  };
  
  export const promptHandlers = {
    "create-issue-description": ({title, type, details}: { title: string, type: string, details: string }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please generate a detailed GitHub issue description for an issue titled "${title}". 
                    This is a ${type} issue. 
                    Additional details: ${details}
                    
                    Format the description with appropriate markdown, including:
                    - Clear problem statement
                    - Steps to reproduce (if applicable)
                    - Expected vs actual behavior (if applicable)
                    - Any relevant context or background information`,
            }
          }
        ]
      }
    },
    "create-pull-request-description": ({title, changes, relatedIssue}: { title: string, changes: string, relatedIssue?: string }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please generate a detailed GitHub pull request description for a PR titled "${title}".
                    Changes made: ${changes}
                    ${relatedIssue ? `Related issue: #${relatedIssue}` : ''}
                    
                    Format the description with appropriate markdown, including:
                    - Summary of changes
                    - Implementation details
                    - Testing performed
                    - Any breaking changes or considerations
                    ${relatedIssue ? `- Reference to issue #${relatedIssue}` : ''}`,
            }
          }
        ]
      }
    },
    "search-repos-prompt": ({ description, language, stars }: { description: string, language?: string, stars?: string }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please help me formulate a GitHub repository search query based on the following criteria:
                    - I'm looking for repositories related to: ${description}
                    ${language ? `- Programming language: ${language}` : ''}
                    ${stars ? `- Minimum stars: ${stars}` : ''}
                    
                    Create a query string that follows GitHub's search syntax, including appropriate qualifiers like 'language:', 'stars:>', etc.
                    Only return the final query string without explanation.`,
            }
          }
        ]
      }
    },
    "create-issue-prompt": ({ description, repositoryContext }: { description: string, repositoryContext: string }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please help me create a GitHub issue based on the following information:
                    - Issue description: ${description}
                    - Repository context: ${repositoryContext}
                    
                    Generate the following in JSON format:
                    {
                      "title": "A concise title for the issue",
                      "body": "A detailed description of the issue with appropriate markdown formatting",
                      "labels": ["suggested", "labels", "based", "on", "context"]
                    }
                    
                    Only return the JSON object without explanation.`,
            }
          }
        ]
      }
    },
    "enhance-github-response": ({ responseData, responseType }: { responseData: string, responseType: string }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please format and enhance the following raw GitHub API response data:
                    
                    ${responseData}
                    
                    This is a response of type: ${responseType}
                    
                    Format the data in a readable way, highlighting the most important information, and adding any relevant analysis or insights.
                    Use markdown formatting to make the output clean and easy to read.`,
            }
          }
        ]
      }
    }
  };