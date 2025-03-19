import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { setupHandlers } from "./handlers.js";

const server = new Server(
    {
        name: "github-mcp",
        version: "1.0.0"
    },
    {
        capabilities: {
            prompts: {}, // enable prompts
            tools: {} // enable tools
        }
    }
);

setupHandlers(server);

const transport = new StdioServerTransport();
await server.connect(transport);
console.info("connected...")