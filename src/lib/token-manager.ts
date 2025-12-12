import { API_CONFIG } from "@/lib/config";
import { useAuthStore } from "@/lib/store/auth-store";
import { showToast } from "@/lib/toast";

class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private failedRequests: Array<{
    resolve: () => void;
    reject: (err: Error) => void;
  }> = [];

  private readonly REFRESH_INTERVAL = 6 * 24 * 60 * 60 * 1000; // 6 days

  startAutoRefresh() {
    this.stopAutoRefresh();
    this.refreshTimer = setInterval(
      () => this.refreshToken(),
      this.REFRESH_INTERVAL,
    );
  }

  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Make it public so apiClient can call it
  public async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) return false;
    this.isRefreshing = true;

    try {
      const response = await fetch(`${API_CONFIG.API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      if (!data.token) throw new Error("No token returned");

      const { setAuth } = useAuthStore.getState();
      setAuth(data.admin || null, data.token);

      // Success – resolve all queued requests
      for (const { resolve } of this.failedRequests) {
        resolve();
      }
      this.failedRequests = [];

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      for (const { reject } of this.failedRequests) {
        reject(error as Error);
      }
      this.failedRequests = [];
      this.logout();
      showToast.error("Session expired. Please log in again.");
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  public async handleApiError(
    response: Response,
    retryFn: () => Promise<Response>,
  ): Promise<Response> {
    if (response.status !== 401) return response;

    // Wait for ongoing refresh
    if (this.isRefreshing) {
      await new Promise<void>((resolve, reject) => {
        this.failedRequests.push({ resolve, reject });
      });
    }

    const refreshed = await this.refreshToken();
    return refreshed ? retryFn() : response;
  }

  public logout() {
    this.stopAutoRefresh();
    useAuthStore.getState().clearAuth();
    window.location.href = "/login";
  }

  public init() {
    if (useAuthStore.getState().token) {
      this.startAutoRefresh();
    }
  }
}

export const tokenManager = new TokenManager();
