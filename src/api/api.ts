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
  return response.data;
};

export const fetchUserInfo = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await axiosInstance.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};
