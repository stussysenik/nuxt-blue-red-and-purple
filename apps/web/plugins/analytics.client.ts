export default defineNuxtPlugin((nuxtApp) => {
  // Track page views in SQLite
  const route = useRoute();

  function trackView(path: string) {
    $fetch('/api/view', {
      method: 'POST',
      body: { path },
    }).catch(() => {
      // Silently fail - analytics non-critical
    });
  }

  // Track initial page view
  trackView(route.path);

  // Track on route changes
  nuxtApp.hook('page:finish', () => {
    trackView(route.path);
  });
});
