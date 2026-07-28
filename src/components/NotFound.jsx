import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">

      <h1 className="text-8xl font-bold text-blue-600">404</h1>

      <h2 className="text-2xl font-semibold text-gray-800 mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-600 text-center max-w-md mt-2 mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-300"
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
