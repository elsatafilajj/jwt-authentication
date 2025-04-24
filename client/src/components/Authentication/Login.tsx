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
    <section className="bg-gray-50 dark:bg-gray-100">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-[rgb(73,185,28)] dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-white rounded-lg">
            <a
              href="#"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              <img className="w-auto h-6 mr-2" src="/logo.png" alt="logo" />
            </a>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-green-900 md:text-2xl">
              Log in
            </h1>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                mutateAsync(values);
              }}
            >
              <Form className="space-y-4 md:space-y-6" action="#">
                {/* Email */}
                <Input
                  label="Your email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                />
                {/* Password */}
                <Input
                  label="Your password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Login
                </button>

                <p className="text-sm font-light text-green-900">
                  You don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-green-800 underline"
                  >
                    Signup here
                  </Link>
                </p>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
