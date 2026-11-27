const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("velour_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = { detail: res.statusText };
    }
    const err = new Error(errorData.detail || "Request failed");
    err.status = res.status;
    err.data = errorData;
    throw err;
  }

  if (res.status === 204) return null;
  return res.json();
}

export const storeApi = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "ALL") {
        qs.set(k, v);
      }
    });
    const query = qs.toString();
    return request(`/store/products/${query ? `?${query}` : ""}`);
  },
  getProductDetail: (id) => request(`/store/products/${id}/`),
  getCategories: () => request("/store/categories/"),
  getColors: () => request("/store/colors/"),
  getSizes: () => request("/store/sizes/"),
};

export const authApi = {
  login: async (email, password) => {
    const data = await request("/api/token/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data?.access) {
      localStorage.setItem("velour_access_token", data.access);
      if (data.refresh) localStorage.setItem("velour_refresh_token", data.refresh);
    }
    return data;
  },
  register: async ({ username, email, password }) => {
    return request("/users/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
  },
  whoami: () => request("/users/whoami/"),
  logout: () => {
    localStorage.removeItem("velour_access_token");
    localStorage.removeItem("velour_refresh_token");
  },
};

export function resolveImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/images/")) {
    return url;
  }
  return `${API_BASE}${url.startsWith("/") ? "" : "/media/"}${url}`;
}
