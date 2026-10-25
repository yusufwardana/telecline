#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const SendMessageToolSchema = z.object({
  message: z.string().min(1),
  workspaceId: z.string().optional(),
});

const server = new Server(
  {
    name: 'telecline-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'telecline_send_message',
      description: 'Send a message through the TeleCline bridge',
      inputSchema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          workspaceId: { type: 'string' },
        },
        required: ['message'],
      },
    },
    {
      name: 'telecline_get_status',
      description: 'Return TeleCline bridge status',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    {
      name: 'telecline_get_recent_messages',
      description: 'Return recent bridge messages',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    {
      name: 'telecline_get_bridge_health',
      description: 'Return TeleCline bridge health check',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'telecline_send_message') {
    const parsed = SendMessageToolSchema.safeParse(args ?? {});
    if (!parsed.success) {
      throw new Error(`Invalid arguments for telecline_send_message: ${parsed.error.message}`);
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ ok: true, message: parsed.data.message, workspaceId: parsed.data.workspaceId ?? 'default' }, null, 2),
      }],
    };
  }

  if (name === 'telecline_get_status') {
    return {
      content: [{ type: 'text', text: JSON.stringify({ connected: true, status: 'connected', message: 'Bridge is ready' }, null, 2) }],
    };
  }

  if (name === 'telecline_get_recent_messages') {
    return {
      content: [{ type: 'text', text: JSON.stringify({ messages: [] }, null, 2) }],
    };
  }

  if (name === 'telecline_get_bridge_health') {
    return {
      content: [{ type: 'text', text: JSON.stringify({ healthy: true, uptimeMs: 0 }, null, 2) }],
    };
  }

  throw new Error(`Unsupported tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('TeleCline MCP server started');
