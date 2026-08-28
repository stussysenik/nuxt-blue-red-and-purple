import { ref, onMounted, onUnmounted } from 'vue';

interface ToolbarState {
  visible: boolean;
  lastHiddenAt: number | null;
  scrollCount: number;
  featureFlags: Record<string, boolean>;
}

export function useToolbar() {
  const visible = ref(true);
  const isReady = ref(false);
  const scrollY = ref(0);
  const lastScrollY = ref(0);
  const isScrollingDown = ref(false);

  let ticking = false;

  // Fetch initial state from SQLite
  async function fetchState() {
    try {
      const data = await $fetch<ToolbarState>('/api/toolbar');
      visible.value = data.visible;
      isReady.value = true;
    } catch {
      // If API fails, default to visible
      visible.value = true;
      isReady.value = true;
    }
  }

  // Persist visibility state to SQLite
  async function persistVisibility(v: boolean) {
    try {
      await $fetch('/api/toolbar', {
        method: 'POST',
        body: { visible: v },
      });
    } catch {
      // Silently fail - localStorage fallback could go here
    }
  }

  // Track scroll count in SQLite
  async function trackScroll() {
    try {
      await $fetch('/api/toolbar', {
        method: 'POST',
        body: { incrementScroll: true },
      });
    } catch {
      // Silently fail
    }
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        isScrollingDown.value = currentY > lastScrollY.value;
        scrollY.value = currentY;

        // Hide toolbar when scrolling down past threshold
        if (currentY > 100 && isScrollingDown.value) {
          if (visible.value) {
            visible.value = false;
            persistVisibility(false);
          }
        }

        // Show toolbar when scrolling up
        if (!isScrollingDown.value) {
          if (!visible.value) {
            visible.value = true;
            persistVisibility(true);
          }
        }

        lastScrollY.value = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }

  onMounted(() => {
    fetchState();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
  });

  return {
    visible,
    isReady,
    scrollY,
    isScrollingDown,
    trackScroll,
  };
}
