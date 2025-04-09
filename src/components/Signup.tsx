import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LogoImg from "../assets/stuck-full.png";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/api";
import { Link } from "react-router-dom";

const Signup = () => {
  const { mutateAsync } = useMutation({
    mutationFn: signup,
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
      [true],
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
              <img className="w-auto h-6  mr-2" src={LogoImg} alt="logo" />
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
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-green-900"
                  >
                    Your username
                  </label>
                  <Field
                    type="username"
                    name="username"
                    id="username"
                    className="bg-green-100 border border-green-300 text-green-900 placeholder-green-600 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                    placeholder="Username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-green-900"
                  >
                    Your email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="bg-green-100 border border-green-300 text-green-900 placeholder-green-600 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                    placeholder="name@company.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-green-900"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-green-100 border border-green-300 text-green-900 placeholder-green-600 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-green-900"
                  >
                    Confirm password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="••••••••"
                    className="bg-green-100 border border-green-300 text-green-900 placeholder-green-600 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Field
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-green-300 rounded bg-green-100 focus:ring-green-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-green-800"
                    >
                      I accept the{" "}
                      <a
                        href="#"
                        className="font-medium text-green-900 underline"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                  <ErrorMessage
                    name="terms"
                    component="div"
                    className="text-sm text-red-500"
                  />
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
