# TeleCline

TeleCline is a Windows-compatible Telegram ↔ Cline bridge for VS Code. The project is structured as a TypeScript monorepo with a Telegram gateway, a VS Code companion extension, and an MCP server.

## Status

This initial implementation establishes the project skeleton, shared contracts, and the verified TypeScript build paths. It does not claim end-to-end Telegram-to-Cline execution without a compatible Cline integration API and real bot credentials.

## Structure

- `apps/telegram-gateway` — Telegram bot entry point
- `apps/vscode-extension` — VS Code extension shell
- `packages/mcp-server` — stdio MCP server
- `packages/cline-adapter` — Cline integration facade
- `packages/security` — authorization and redaction utilities
- `packages/shared` — message envelopes and shared contracts

## Getting started

1. Install dependencies:
   `npm install`
2. Build the workspace:
   `npm run build`
3. Run tests:
   `npm test`

## Known limitation

Actual automatic Cline event capture is not yet implemented because the installed workspace does not contain the Cline extension, so the supported integration surface cannot be verified in this environment. The project therefore marks the automatic message injection path as BLOCKED until a verified Cline API or supported extension integration point is present.
