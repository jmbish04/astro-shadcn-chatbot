import React from 'react';
import { useAgentChat } from '@cloudflare/ai-chat/react';
import { useAgent } from 'agents/react';

export function ChatWorkspace() {
  const agent = useAgent({
    agent: 'orchestrator-agent',
    name: 'default-session-id',
  });

  const { messages, sendMessage, status, isStreaming } = useAgentChat({
    agent,
    resume: true,
  });

  const [input, setInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ role: 'user', content: input });
      setInput('');
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
        <h1 className="text-xl font-semibold text-zinc-50">AI Chatbot</h1>
        <p className="text-sm text-zinc-400">Powered by Cloudflare Workers & AI</p>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-zinc-300">Welcome to the Chatbot</h2>
              <p className="text-zinc-500">Start a conversation by typing a message below</p>
            </div>
          </div>
        )}

        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-zinc-800 text-zinc-50'
                  : 'bg-zinc-900 text-zinc-100'
              }`}
            >
              <div className="text-xs text-zinc-500 mb-1 font-medium uppercase">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
              </div>
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-zinc-900 px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-zinc-500 animate-pulse" />
                <div className="h-2 w-2 rounded-full bg-zinc-500 animate-pulse delay-75" />
                <div className="h-2 w-2 rounded-full bg-zinc-500 animate-pulse delay-150" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-zinc-800 bg-zinc-950 px-6 py-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-50 placeholder-zinc-500 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="rounded-lg bg-zinc-50 px-6 py-3 font-medium text-zinc-950 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
        <div className="mt-2 text-xs text-zinc-600">
          Status: {status || 'ready'}
        </div>
      </div>
    </div>
  );
}
