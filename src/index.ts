import { Hono } from 'hono';
import { routeAgentRequest } from 'agents';
import { OrchestratorAgent } from './backend/agent';

type Env = {
  ASSETS: Fetcher;
  AI: Ai;
  ORCHESTRATOR_AGENT: DurableObjectNamespace;
};

const app = new Hono<{ Bindings: Env }>();

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'healthy', timestamp: Date.now() }));

// Direct AI routing endpoint using Cloudflare AI Gateway
app.post('/api/chat/direct', async (c) => {
  const { messages, model } = await c.req.json();

  // Enforce AI Gateway wrapper for Workers AI models
  const response = await c.env.AI.run(
    model || '@cf/meta/llama-3.1-8b-instruct',
    { messages },
    {
      gateway: {
        id: "colby-gateway",
      }
    }
  );

  return c.json(response);
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. API Route Matching via Hono
    if (url.pathname.startsWith('/api/')) {
      return app.fetch(request, env, ctx);
    }

    // 2. State-Persistent DO Handshake Matching via Agents SDK
    // Matches routes: /agents/:agent-class/:instance-id
    if (url.pathname.startsWith('/agents/')) {
      const response = await routeAgentRequest(request, env);
      if (response) return response;
    }

    // 3. Fail-secure Fallback to Astro Static Assets
    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;

export { OrchestratorAgent };
