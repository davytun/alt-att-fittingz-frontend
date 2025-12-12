export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    verifyEmail: "/auth/verify-email",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyResetCode: "/auth/verify-reset-code",
    resendVerification: "/auth/resend-verification",
  },
  profile: {
    get: "/profile",
    update: "/profile",
  },
  users: {
    me: "/users/me",
    list: "/users",
    byId: (id: string) => `/users/${id}`,
  },
  clients: {
    list: "/clients",
    create: "/clients",
    byId: (id: string) => `/clients/${id}`,
    update: (id: string) => `/clients/${id}`,
    delete: (id: string) => `/clients/${id}`,
  },
  recentUpdates: {
    list: (limit?: number) =>
      `/recent-updates${limit ? `?limit=${limit}` : ""}`,
    summary: (days = 7) => `/recent-updates/summary?days=${days}`,
  },
  notifications: {
    list: "/notifications",
    unreadCount: "/notifications/unread-count",
    markAsRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: "/notifications/mark-all-read",
    delete: (id: string) => `/notifications/${id}`,
  },
} as const;
