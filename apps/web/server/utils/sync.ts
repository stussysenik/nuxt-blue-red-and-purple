// Real-time sync via Server-Sent Events (SSE).
// Lightweight pub/sub — no new dependencies. SQLite is the source of truth;
// this just pushes change notifications to connected clients.

type Listener = (data: any) => void;

const listeners = new Set<Listener>();

export function addListener(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function broadcastUpdate(data: any): void {
  for (const fn of listeners) {
    try {
      fn(data);
    } catch {
      // dead listener — will be cleaned up on next broadcast
    }
  }
}

// SSE endpoint handler
export function createSSEHandler(event: any): void {
  const nodeEvent = event.node.res;
  nodeEvent.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  // Send initial hello
  nodeEvent.write(`event: connected\ndata: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);

  const unsubscribe = addListener((data: any) => {
    nodeEvent.write(`event: update\ndata: ${JSON.stringify(data)}\n\n`);
  });

  // Heartbeat every 25s to keep the connection alive
  const heartbeat = setInterval(() => {
    nodeEvent.write(`: heartbeat\n\n`);
  }, 25_000);

  // Clean up on disconnect
  const cleanup = () => {
    clearInterval(heartbeat);
    unsubscribe();
  };

  nodeEvent.on('close', cleanup);
  nodeEvent.on('error', cleanup);

  // Handle H3 request destruction
  event.node.req.on('close', cleanup);
}
