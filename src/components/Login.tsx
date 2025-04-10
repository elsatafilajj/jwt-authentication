import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import LogoImg from "../assets/stuck-full.png";
import { useMutation } from "@tanstack/react-query";
import { loginApiCall } from "../api/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { mutateAsync } = useMutation({
    mutationFn: loginApiCall,
    onSuccess: (data) => {
      toast.success("You are logged in 🎉!");
      login(data);
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Invalid email or password";
      toast.error(message);
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
              <img className="w-auto h-6  mr-2" src={LogoImg} alt="logo" />
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
                    required
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
                    required
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Login
                </button>

                <p className="text-sm font-light text-green-900">
                  You don't have an account?
                  <Link
                    to="/signup"
                    className="font-medium text-green-800 underline"
                  >
                    {" "}
                    Signin here
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
