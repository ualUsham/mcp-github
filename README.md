# GitHub MCP (Model Context Protocol) server

Hello! This is a GitHub MCP server designed to enable MCP-compatible LLMs, such as Claude, to communicate with my MCP server and interact with the GitHub API.


# Requirements
- TypeScript (programming language)
- Octokit (for making API requests to GitHub)
- Model Context Protocol SDK

## Setup the project locally

1. Clone the repository
2. Run `npm install`
3. Add `.env` file looking at the sample provided in `.env.example` file
4. To build the TypeScript files to Javascript, run `npx tsc`
5. To finally run the project, run `node build/index.js`

## Ways to test

You can test your MCP server in 2 ways:
- MCP inspector
- Claude Desktop

## Test using MCP inspector

1. Simply run `npx @modelcontextprotocol/inspector node build/index.js` in the terminal
2. Go to http://localhost:5173
3. You can now see the **MCP inspector** and test.

## Test using Claude Desktop

1. Download and install Claude Desktop from [here](https://claude.ai/download)
2. Go to File > Settings... > Developer > Edit Config
3. It should open up the location of claude_desktop_config.json file.
4. Open that file in your code editor and add the following:
	 ```json
	{
	  "mcpServers": {
	    "gh": {
	      "command": "node",
	      "args": ["absolute\\path\\to\\your\\index.js\\file"],
	      "env": {
	        "GITHUB_TOKEN": "your-github-personal-access-token"
	      }
	    }
	  }
	}
	```
5. Exit and reopen Claude desktop

## Functionalities

The **MCP** supports mainly *two* features:
 - Tools (4)
	 - `create-issue`: create a new issue in a GitHub repository
	 - `get-repo-info`: get information about a specific GitHub repository
	 - `list-issues`: list issues in a GitHub repository
	 - `search-repos`: Search for GitHub repositories
 - Prompts (5)
	 - `create-issue-description`: generate a description for a GitHub issue
	 - `create-pull-request-description`: generate a description for a GitHub pull request
	 - `search-repos-prompt`: generate a query for searching GitHub repositories
	 - `create-issue-prompt`: generate parameters for creating a GitHub issue
	 - `enhance-github-response`: format and enhance raw GitHub API response data

> You can write your own prompts or select a suitable prompt from the dropdown in the "Choose an integration"  option for MCP in Claude desktop