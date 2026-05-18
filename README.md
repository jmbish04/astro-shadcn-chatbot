# Astro + Cloudflare Workers Chatbot

A modern, full-stack AI chatbot application built with Astro 6, Hono, and the Cloudflare Agents SDK, running entirely on Cloudflare Workers Assets.

## Architecture

This application uses a unified architecture running on Cloudflare Workers:

- **Frontend**: Astro 6 with React components for SSR
- **API Layer**: Hono for RESTful endpoints
- **Stateful Agents**: Cloudflare Agents SDK with Durable Objects
- **AI Gateway**: All AI model requests route through Cloudflare AI Gateway
- **Static Assets**: Served via Workers Assets (no Cloudflare Pages)

## Key Technologies

- **Astro 6** - Server-side rendering framework
- **Hono** - Fast, lightweight web framework for routing
- **Cloudflare Agents SDK** - Stateful AI agents with WebSocket support
- **Workers AI** - AI model inference via Cloudflare's AI platform
- **AI Gateway** - Unified gateway for AI model routing and observability
- **Durable Objects** - Persistent state with SQLite storage
- **Tailwind CSS v4** - Modern utility-first CSS framework

## Project Structure

```
├── src/
│   ├── index.ts              # Main Worker entry point with routing
│   ├── backend/
│   │   └── agent.ts          # OrchestratorAgent (AIChatAgent)
│   ├── pages/
│   │   ├── index.astro       # Main chat page
│   │   └── 404.astro         # 404 error page
│   ├── layouts/
│   │   └── Layout.astro      # Base HTML layout
│   ├── components/
│   │   └── ChatWorkspace.tsx # Chat UI component
│   └── styles/
│       └── global.css        # Global styles with Tailwind
├── astro.config.mjs          # Astro configuration
├── wrangler.jsonc            # Cloudflare Workers configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Routing Architecture

The application uses a three-tier routing system:

1. **API Routes** (`/api/*`) - Handled by Hono for REST endpoints
2. **Agent Routes** (`/agents/*`) - WebSocket connections to Durable Objects
3. **Static Assets** - All other routes fallback to Astro static files

## Getting Started

### Prerequisites

- Node.js 22 or higher (required for Astro 6)
- pnpm package manager
- Cloudflare account

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

This starts the Wrangler development server with local bindings.

### Build

```bash
pnpm build
```

Builds the Astro site and prepares it for deployment.

### Deploy

```bash
pnpm deploy
```

Deploys to Cloudflare Workers.

## Configuration

### AI Gateway

Update the gateway ID in both files:

- `src/index.ts` - Direct API endpoint
- `src/backend/agent.ts` - Agent streaming responses

Replace `"colby-gateway"` with your AI Gateway ID.

### Environment Variables

Create a `.dev.vars` file for local development:

```
# Add any secrets here for local development
```

For production, use `wrangler secret put` to set secrets.

## Features

- ✅ Real-time chat with AI using WebSocket connections
- ✅ Persistent conversation history in Durable Objects SQLite
- ✅ Streaming responses from Workers AI
- ✅ AI Gateway integration for observability and caching
- ✅ Dark theme with high-contrast design
- ✅ Server-side rendering with Astro
- ✅ Type-safe TypeScript throughout

## Design Philosophy

This application follows the "Monolith/Moody Modern" design system:

- Dark theme (bg-zinc-950) with high contrast
- Inter font family
- Border-free, seamless layouts
- Minimal, editorial approach to technical interfaces

## Important Notes

- **No Next.js**: This project has been completely retrofitted from Next.js
- **No Vercel AI SDK Bindings**: Uses native Cloudflare integrations
- **No Cloudflare Pages**: Runs entirely on Workers with Workers Assets
- **AI Gateway Required**: All AI model transactions must route through AI Gateway

## Learn More

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/)
- [Workers AI](https://developers.cloudflare.com/workers-ai/)
- [AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [Astro Documentation](https://docs.astro.build/)
- [Hono Framework](https://hono.dev/)
