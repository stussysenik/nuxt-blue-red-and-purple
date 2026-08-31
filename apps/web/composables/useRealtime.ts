import { ref, onMounted, onUnmounted } from 'vue';

// Real-time sync composable using Server-Sent Events.
// Connects to /api/sync and listens for content updates from the admin.
// When an update arrives, it patches the local content ref and refreshes.

export function useRealtime(onUpdate?: (key: string, value: string) => void) {
  const connected = ref(false);
  const lastUpdate = ref<{ key: string; value: string; timestamp: number } | null>(null);
  let eventSource: EventSource | null = null;

  onMounted(() => {
    if (typeof window === 'undefined') return;

    eventSource = new EventSource('/api/sync');

    eventSource.addEventListener('connected', () => {
      connected.value = true;
    });

    eventSource.addEventListener('update', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'content_update') {
          lastUpdate.value = data;
          onUpdate?.(data.key, data.value);
        }
      } catch {
        // ignore malformed messages
      }
    });

    eventSource.onerror = () => {
      connected.value = false;
      // EventSource auto-reconnects by default
    };
  });

  onUnmounted(() => {
    eventSource?.close();
  });

  return { connected, lastUpdate };
}
