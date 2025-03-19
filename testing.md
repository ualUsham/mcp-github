
# Testing Prompts

## Create Issue Description:

```typescript
await client.getPrompt("create-issue-description", {
  title: "Navigation menu disappears on mobile",
  type: "bug",
  details: "When viewing the site on mobile devices, the navigation menu disappears after clicking on any link. This happens on iOS and Android devices."
});
```

## Create Pull Request Description:

```typescript
await client.getPrompt("create-pull-request-description", {
  title: "Fix mobile navigation menu",
  changes: "Fixed the event handler for mobile navigation links to prevent the default behavior. Updated the CSS to ensure proper display on smaller screens.",
  relatedIssue: "42"
});
```

## Search Repos Prompt:

```typescript
await client.getPrompt("search-repos-prompt", {
  description: "state management libraries for React",
  language: "typescript",
  stars: "1000"
});
```

## Create Issue Prompt:

```typescript
await client.getPrompt("create-issue-prompt", {
  description: "Login fails when using OAuth with Google accounts",
  repositoryContext: "This is a Next.js application with NextAuth.js for authentication"
});
```

## Enhance GitHub Response:

```typescript
await client.getPrompt("enhance-github-response", {
  responseData: `[{"name":"octokit/octokit.js","description":"The all-batteries-included GitHub SDK for Browsers, Node.js, and Deno.","stars":5432,"url":"https://github.com/octokit/octokit.js","language":"TypeScript","forks":721}]`,
  responseType: "repos"
});
```

# Testing Tools

## Search Repositories:

```typescript
await client.callTool("search-repos", {
  query: "language:typescript stars:>1000 topic:react",
  sort: "stars",
  limit: 5
});
```

## Get Repository Info:

```typescript
await client.callTool("get-repo-info", {
  owner: "facebook",
  repo: "react"
});
```

## List Issues:

```typescript
await client.callTool("list-issues", {
  owner: "facebook",
  repo: "react",
  state: "open",
  limit: 10
});
```

## Create Issue:

```typescript
await client.callTool("create-issue", {
  owner: "your-username",
  repo: "your-repo",
  title: "Update documentation for installation process",
  body: "The current documentation is missing steps for installation on Windows. We should add a section specifically for Windows users.",
  labels: ["documentation", "good first issue"]
});
```

## Combined Prompt and Tool Usage
1. Generate a search query

```typescript
const searchQuery = await client.getPrompt("search-repos-prompt", {
  description: "GraphQL clients",
  language: "javascript",
  stars: "5000"
});
```

2. Use the generated query to search for repositories

```typescript
const repoResults = await client.callTool("search-repos", {
  query: searchQuery,
  limit: 3
});
```

3. Get detailed information about the first repository

```typescript
const repoInfo = JSON.parse(repoResults);
const firstRepo = repoInfo[0];
const detailedInfo = await client.callTool("get-repo-info", {
  owner: firstRepo.name.split('/')[0],
  repo: firstRepo.name.split('/')[1]
});
```

4. Generate an issue description

```typescript
const issueDescription = await client.getPrompt("create-issue-description", {
  title: "Add TypeScript example to documentation",
  type: "enhancement",
  details: "The documentation lacks TypeScript examples for basic operations."
});
```

5. Create the issue

```typescript
await client.callTool("create-issue", {
  owner: firstRepo.name.split('/')[0],
  repo: firstRepo.name.split('/')[1],
  title: "Add TypeScript example to documentation",
  body: issueDescription,
  labels: ["documentation", "enhancement"]
});
```