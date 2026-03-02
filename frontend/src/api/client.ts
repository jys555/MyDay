import axios from "axios";

// Get API base URL from env or use Railway backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_RAILWAY_BACKEND_URL ||
  "";

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL or VITE_RAILWAY_BACKEND_URL must be set");
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export function setUserIdHeader(userId: number) {
  api.defaults.headers.common["x-user-id"] = String(userId);
}

