import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_BASE_URL;
console.log(baseUrl);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-type": "application/json" },
});
console.log(import.meta.env.VITE_BASE_URL);

interface SignupProps {
  username: string;
  email: string;
  password: string;
}

export const signup = async (user: SignupProps) => {
  try {
    const response = await axiosInstance.post("/signup", {
      username: user.username,
      email: user.email,
      password: user.password,
    });
    console.log(response.data);
    toast.success("You have been signed up successfully 🎉!");
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong!");
  }
};

export const login = async (user: Partial<SignupProps>) => {
  try {
    const response = await axiosInstance.post("/login", {
      email: user.email,
      password: user.password,
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong!");
  }
};
