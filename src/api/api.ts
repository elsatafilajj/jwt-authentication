import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

interface SignupProps {
  username: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

interface LoginProps {
  email: string;
  password: string;
}

const setTokenToLocalStorage = (data: {
  accessToken: string;
  refreshToken: string;
}) => {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
};

export const signup = async (user: SignupProps) => {
  try {
    const requestBody: SignupProps = {
      username: user.username,
      email: user.email,
      password: user.password,
    };

    if (user.role) {
      requestBody.role = user.role;
    }

    const response = await axiosInstance.post("/signup", requestBody);

    setTokenToLocalStorage(response.data);
    console.log(response.data);
    toast.success("You have been signed up successfully 🎉!");
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    toast.error("Something went wrong!");
  }
};

export const login = async (user: LoginProps) => {
  try {
    const response = await axiosInstance.post("/login", {
      email: user.email,
      password: user.password,
    });
    setTokenToLocalStorage(response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Login failed!");
    return null;
  }
};

export const fetchUserInfo = async () => {
  const token = localStorage.getItem("accessToken");
  console.log("Current access token:", token);

  try {
    const response = await axiosInstance.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("User info:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch user info error:", error);
    throw error;
  }
};

/* REFRESH TOKEN */
export const refreshToken = async (): Promise<string | null> => {
  const storedRefreshToken = localStorage.getItem("refreshToken");

  if (!storedRefreshToken) {
    console.log("No refresh token found!");
    return null;
  }

  try {
    const response = await axiosInstance.post("/refresh-token", {
      refreshToken: storedRefreshToken,
    });
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    console.log(
      "Refreshed tokens:",
      "Access Token:",
      localStorage.getItem("accessToken"),
      "Refresh Token:",
      localStorage.getItem("refreshToken")
    );
    return response.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    // Logging out if refresh fails
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.log("Redirecting...");
    window.location.href = "/";
    return null;
  }
};

// Axios response interceptor to auto-refresh token on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Prevent refreshing if the request was to the refresh endpoint itself
    if (
      error.config &&
      error.config.url &&
      error.config.url.includes("/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // Only handle 401 errors and ensure we haven't retried before
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      console.warn("Unauthorized request. Attempting token refresh...");
      try {
        console.log("Old access token:", localStorage.getItem("accessToken"));
        const newAccessToken = await refreshToken();
        console.log("New access token:", newAccessToken);

        if (!newAccessToken) {
          console.error("Refresh token invalid or expired");
          return Promise.reject(error);
        }

        // Set the new access token in the original request and retry
        error.config.headers = {
          ...error.config.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
