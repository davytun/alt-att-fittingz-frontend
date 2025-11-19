import { useAuthStore } from "@/lib/store/auth-store";
import { API_CONFIG } from "@/lib/config";

class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;

  // Refresh token every 14 minutes (before 15-minute expiry)
  private readonly REFRESH_INTERVAL = 14 * 60 * 1000;

  startAutoRefresh() {
    this.stopAutoRefresh();
    this.refreshTimer = setInterval(() => {
      this.refreshToken();
    }, this.REFRESH_INTERVAL);
  }

  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) return false;
    
    this.isRefreshing = true;
    
    try {
      const response = await fetch(`${API_CONFIG.API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          const { setAuth, admin } = useAuthStore.getState();
          setAuth(admin || data.admin, data.token);
          return true;
        }
      }
      
      // Refresh failed - logout user
      useAuthStore.getState().clearAuth();
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      useAuthStore.getState().clearAuth();
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  async handleApiError(response: Response, retryFn: () => Promise<Response>): Promise<Response> {
    if (response.status === 401 && !this.isRefreshing) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        return retryFn();
      }
    }
    return response;
  }
}

export const tokenManager = new TokenManager();