import { type Server } from "@modelcontextprotocol/sdk/server/index.js"
import { CallToolRequestSchema, GetPromptRequestSchema, ListPromptsRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { promptHandlers, prompts } from "./prompts.js";
import { toolHandlers, tools } from "./tools.js";

export const setupHandlers = (server: Server) => {
    // prompts
    server.setRequestHandler(ListPromptsRequestSchema, () => ({
        prompts: Object.values(prompts),
    }))
    server.setRequestHandler(GetPromptRequestSchema, (request) => {
        const { name, arguments: args } = request.params;
        const promptHandler = promptHandlers[name as keyof typeof promptHandlers];
        if (promptHandler) return promptHandler(args as any);
        throw new Error("prompt not found");
    });

    // tools
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: Object.values(tools)
    }));
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        type ToolHandlerKey = keyof typeof toolHandlers;
        const { name, arguments: params } = request.params ?? {};
        const handler = toolHandlers[name as ToolHandlerKey];

        if (!handler) throw new Error("tool not found");

        type HandlerParams = Parameters<typeof handler>;
        return handler(params as any);
    })
}