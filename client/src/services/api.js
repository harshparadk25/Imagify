import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000, // 30s to handle cold-start backends
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry logic for failed requests (handles cold-starts & transient errors)
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Don't retry if we've exhausted retries, or if it's a 4xx client error (except 408 timeout)
    const status = error.response?.status;
    const isRetryable =
      !status ||                    // network error / no response
      status === 408 ||             // request timeout
      status === 429 ||             // rate limit
      (status >= 500 && status < 600); // server error

    if (!isRetryable || (config._retryCount || 0) >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    config._retryCount = (config._retryCount || 0) + 1;
    const delay = RETRY_DELAY_MS * config._retryCount;

    await new Promise((resolve) => setTimeout(resolve, delay));
    return api(config);
  }
);

/**
 * Warm up the backend by pinging /health.
 * Resolves true when backend is reachable, false after all retries exhausted.
 */
let _warmupPromise = null;

export const warmUpBackend = () => {
  if (_warmupPromise) return _warmupPromise;

  _warmupPromise = (async () => {
    for (let i = 0; i < 3; i++) {
      try {
        await axios.get(`${BACKEND_URL}/health`, { timeout: 30000 });
        return true;
      } catch {
        if (i < 2) await new Promise((r) => setTimeout(r, 2000));
      }
    }
    return false;
  })();

  return _warmupPromise;
};

export default api;
