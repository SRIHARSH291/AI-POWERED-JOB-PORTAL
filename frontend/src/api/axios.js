import axios from "axios";

const API =
"https://ai-powered-job-portal-production.up.railway.app/api";

// 🔥 REQUEST INTERCEPTOR (ADD TOKEN)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  console.log("TOKEN:", token);

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  } 

  return config;
});

// 🔥 RESPONSE INTERCEPTOR (AUTO REFRESH TOKEN)
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      // 🚨 STOP if no refresh token (logout case)
      if (!refresh) {
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return API(originalRequest);

      } catch (err) {
        // ✅ logout properly
        localStorage.clear();
        window.location.href = "/"; // 🔥 FIXED
      }
    }

    return Promise.reject(error);
  }
);

export default API;
