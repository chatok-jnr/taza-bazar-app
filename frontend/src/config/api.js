// API Configuration
// Change this URL based on your environment
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://taza-bazar-app-backend.onrender.com";

// Helper function to build API URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
