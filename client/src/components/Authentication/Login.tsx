import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import { login as loginApiCall } from "../../api/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/auth-context";
import { Input } from "../ui/input";

const Login = () => {
  const { login } = useAuth();

  const { mutateAsync } = useMutation({
    mutationFn: loginApiCall,
    onSuccess: (data) => {
      if (data?.accessToken) {
        login(data.accessToken);
      } else {
        toast.error("Login failed: no access token received");
      }
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <section className="bg-gradient-to-b from-emerald-100 to-white dark:bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <img
            className="mx-auto h-10 w-auto"
            src="/logo-full.svg"
            alt="logo"
          />
          <h2 className="mt-4 text-2xl font-bold text-emerald-800">
            Welcome back
          </h2>
          <p className="text-sm text-emerald-600">Login to your account</p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => mutateAsync(values)}
        >
          <Form className="space-y-4">
            <Input
              label="Your email"
              type="email"
              name="email"
              placeholder="name@company.com"
              required
            />
            <Input
              label="Your password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
            <button
              type="submit"
              className="w-full bg-primary hover:bg-emerald-400 text-white font-semibold py-2.5 rounded-lg transition"
            >
              Login
            </button>

            <p className="text-sm text-center text-emerald-700">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium underline text-primary hover:text-emerald-500"
              >
                Signup here
              </Link>
            </p>
          </Form>
        </Formik>
      </div>
    </section>
  );
};

export default Login;
