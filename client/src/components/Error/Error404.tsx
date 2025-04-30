import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="relative  min-h-screen flex flex-col justify-center items-center bg-cover bg-center text-center px-4 bg-[url(/background-error-gradient.png)]">
      {/* overlay */}
      <div className="absolute inset-0 backdrop-blur-xs backdrop-brightness-80 z-0"></div>

      {/* white card */}
      <div className="relative flex flex-col gap-6 z-10 bg-[var(--background)]/20 p-8 rounded-xl text-[var(--secondary)] opacity-100">
        <h3 className="text-xl font-semibold">ERROR</h3>
        <h1 className="text-9xl font-bold mb-2">404</h1>
        <p className="max-w-md mb-6">
          The page you are trying to access doesn’t exist or has been moved. Try
          going back to where you left off.
        </p>
        <Link
          to="/"
          className="px-5 text-white py-2 rounded-full bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 transition duration-300"
        >
          Go back
        </Link>
      </div>
    </div>
  );
};

export default Error404;
