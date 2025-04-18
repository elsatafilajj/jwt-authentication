import React from "react";
import { Link } from "react-router-dom";
import bckImage from "../assets/pexels-jobzky-8022728.jpg";

const Error404 = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center text-center px-4"
      style={{ backgroundImage: `url(${bckImage})` }}
    >
      <div className="bg-[#b0974c] bg-opacity-60 p-8 rounded-xl text-white">
        <h3 className="text-xl font-semibold ">ERROR</h3>
        <h1 className="text-9xl font-bold mb-2">404</h1>
        <p className="text-lg mb-2">This page is outside of the universe.</p>
        <p className="max-w-md mb-6">
          The page you are trying to access doesn’t exist or has been moved. Try
          going back to our homepage.
        </p>
        <Link
          to="/"
          className="px-5 py-2 rounded-full bg-[#726627] hover:bg-[#392e08] transition duration-300"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Error404;
