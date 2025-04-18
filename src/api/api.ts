import axios from "axios";

import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-type": "application/json" },
});

interface SignupProps {
  username: string;
  email: string;
  password: string;
  role?: "user" | "admin";
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
    console.log(error);
    toast.error("Something went wrong!");
  }
};

export const login = async (user: Partial<SignupProps>) => {
  const response = await axiosInstance.post("/login", {
    email: user.email,
    password: user.password,
  });
  setTokenToLocalStorage(response.data);

  console.log(response.data);
  toast.success("You are logged in! 🎉");
  return response.data;
};

export const fetchUserInfo = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await axiosInstance.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axiosInstance.post("/refresh-token", {
          refreshToken,
        });

        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
