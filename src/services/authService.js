import { loginApi } from "../api/authApi";

const STORAGE_KEYS = ["accessToken", "user", "organization", "refreshToken"];

export async function login(email, password) {
    const response = await loginApi({ email, password });
    const { accessToken, user, organization, refreshToken } = response.data.data;

    // Wipe any stale auth from a previous session first.
    STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("organization", JSON.stringify(organization));
    if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    }

    return { accessToken, user, organization, refreshToken };
}
