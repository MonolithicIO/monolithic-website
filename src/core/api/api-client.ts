import { ErrorResponse } from "./error-handler";
import handleResponse from "./handle-response";

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  credentials?: "include" | "omit" | "same-origin";
  skipRefresh?: boolean; // Flag to prevent infinite refresh loops
};

class ApiClient {
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  /**
   * Makes an authenticated API request with automatic token refresh on 401
   */
  async fetch<T>(url: string, options: FetchOptions = {}): Promise<T | ErrorResponse> {
    const { skipRefresh = false, ...fetchOptions } = options;

    // Make the initial request
    let response = await fetch(url, {
      ...fetchOptions,
      credentials: "include", // Include cookies
    });

    // If we get a 401 and haven't already tried to refresh, attempt token refresh
    if (response.status === 401 && !skipRefresh) {
      const refreshed = await this.refreshToken();

      if (refreshed) {
        // Retry the original request with the new token
        response = await fetch(url, {
          ...fetchOptions,
          credentials: "include",
        });
      }
    }

    return handleResponse<T>(response);
  }

  /**
   * Refreshes the authentication token
   * Uses a promise to prevent multiple simultaneous refresh attempts
   */
  private async refreshToken(): Promise<boolean> {
    // If already refreshing, wait for that refresh to complete
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start a new refresh
    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Performs the actual token refresh API call
   */
  private async performRefresh(): Promise<boolean> {
    try {
      const response = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return true;
      }

      // If refresh fails, redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);

      // Redirect to login on error
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return false;
    }
  }

  /**
   * Convenience method for GET requests
   */
  async get<T>(url: string, options?: FetchOptions): Promise<T | ErrorResponse> {
    return this.fetch<T>(url, { ...options, method: "GET" });
  }

  /**
   * Convenience method for POST requests
   */
  async post<T>(url: string, body?: unknown, options?: FetchOptions): Promise<T | ErrorResponse> {
    return this.fetch<T>(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Convenience method for PUT requests
   */
  async put<T>(url: string, body?: unknown, options?: FetchOptions): Promise<T | ErrorResponse> {
    return this.fetch<T>(url, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Convenience method for DELETE requests
   */
  async delete<T>(url: string, options?: FetchOptions): Promise<T | ErrorResponse> {
    return this.fetch<T>(url, { ...options, method: "DELETE" });
  }

  /**
   * Convenience method for PATCH requests
   */
  async patch<T>(url: string, body?: unknown, options?: FetchOptions): Promise<T | ErrorResponse> {
    return this.fetch<T>(url, {
      ...options,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

// Export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
