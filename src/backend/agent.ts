import { AIChatAgent } from '@cloudflare/ai-chat';
import { createWorkersAI } from 'workers-ai-provider';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export class OrchestratorAgent extends AIChatAgent {
  async onChatMessage(onFinish: any, options?: any) {
    // 1. Initialize Workers AI Provider with local system bindings
    const workersai = createWorkersAI({
      binding: this.env.AI,
      gateway: { id: 'colby-gateway' }
    });

    // 2. Execute multi-step stream with AI Gateway parameters
    const result = streamText({
      model: workersai('@cf/meta/llama-3.1-8b-instruct'),
      messages: this.messages,
      system: "You are an elite autonomous operation engine executing within a stateful Cloudflare Worker island. Provide helpful, accurate responses.",
      maxSteps: 10,
      // Declare server-enforced tools executing within edge memory
      tools: {
        persistSessionLog: tool({
          description: 'Persists structured operational logs inside the local SQLite database context layer.',
          parameters: z.object({
            event: z.string(),
            status: z.enum(['success', 'pending', 'failed'])
          }),
          execute: async ({ event, status }) => {
            // Write structured audit steps to DO local SQLite memory
            this.sql`INSERT INTO session_audit (id, event, status, timestamp) VALUES (${crypto.randomUUID()}, ${event}, ${status}, ${Date.now()})`;
            return { committed: true, msg: 'Audit checkpoint recorded successfully.' };
          }
        })
      }
    });

    // 3. Return streaming response
    return result.toDataStreamResponse();
  }

  // Handle Lifecycle Instantiation Phase
  async onStart(): Promise<void> {
    // Scaffold necessary SQLite structures safely behind migration layers
    this.sql`
      CREATE TABLE IF NOT EXISTS session_audit (
        id TEXT PRIMARY KEY,
        event TEXT,
        status TEXT,
        timestamp INTEGER
      );
    `;
  }
}
