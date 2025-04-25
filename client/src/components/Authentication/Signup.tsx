import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth-context";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { mutateAsync } = useMutation({
    mutationFn: signup,

    onSuccess: (data) => {
      if (data?.accesstoken) {
        login(data.accesstoken);
      }
      navigate("/");
    },
  });

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(2, "Too Short")
      .max(50, "Too Long!")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
    terms: Yup.boolean().oneOf(
      [false],
      "You must accept the terms and conditions"
    ),
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
              <img className="w-auto h-6  mr-2" src="/logo.png" alt="logo" />
            </a>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-green-900 md:text-2xl">
              Create an account
            </h1>
            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                terms: false,
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                mutateAsync(values);
                console.log(values);
              }}
            >
              <Form className="space-y-4 md:space-y-6">
                {/* Username */}
                <Input
                  type="text"
                  name="username"
                  label="Your Username"
                  placeholder="Username"
                />
                {/* Email */}
                <Input
                  type="text"
                  name="email"
                  label="Your email"
                  placeholder="name@company.com"
                />
                {/* Password */}
                <Input
                  type="password"
                  name="password"
                  label="Your password"
                  placeholder="••••••••"
                />
                {/* Confirm Password */}
                <Input
                  type="password"
                  name="confirmPassword"
                  label="Confirm password"
                  placeholder="••••••••"
                />

                {/* Terms Checkbox */}
                <div className="flex gap-3 items-center align-middle">
                  <Checkbox name="terms" />
                  <label
                    htmlFor="terms"
                    className="flex align-center text-sm font-medium text-green-900"
                  >
                    I accept the terms and conditions
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Create an account
                </button>

                <p className="text-sm font-light text-green-900">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-green-800 underline"
                  >
                    Login here
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

export default Signup;
