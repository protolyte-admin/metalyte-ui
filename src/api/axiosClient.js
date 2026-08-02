import axios from "axios";

console.log("VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
    
    headers: { "Content-Type": "application/json" }
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        // 401: token rejected. 403 with an auth-related message is a separate
        // concern (role-based) and should NOT trigger a redirect.
        if (status === 401) {
            const hadToken = !!localStorage.getItem("accessToken");
            // Wipe storage so ProtectedRoute redirects on the next render.
            ["accessToken", "user", "organization", "refreshToken"].forEach(
                (k) => localStorage.removeItem(k)
            );
            // Use a hard replace so the user can't navigate back into a
            // protected page from /login.
            if (typeof window !== "undefined" && hadToken) {
                const here = window.location.pathname + window.location.search;
                window.location.replace(
                    `/login?from=${encodeURIComponent(here)}`
                );
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
