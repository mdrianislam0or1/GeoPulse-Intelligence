export const SOCKET_EVENTS = {
  // News
  NEWS_INGESTED: 'news:ingested',
  ANALYSIS_COMPLETE: 'analysis:complete',

  // Crisis
  CRISIS_ALERT: 'crisis:alert',
  EARLY_WARNING: 'crisis:early_warning',

  // Geo
  STABILITY_UPDATE: 'stability:update',

  // User
  WATCHLIST_ALERT: 'watchlist:alert',

  // Dashboard
  DASHBOARD_UPDATE: 'dashboard:update',
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
