import React from "react";
import { useNavigate } from "react-router-dom";

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">

      <h1 className="text-8xl font-bold text-red-500">403</h1>

      <h2 className="text-2xl font-semibold text-gray-800 mt-4">
        Access Denied
      </h2>

      <p className="text-gray-600 text-center max-w-md mt-2 mb-8">
        You don't have permission to access this page. If you believe this is a
        mistake, please contact your administrator.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-300"
        >
        <i class="bi bi-arrow-left"></i> Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-300"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
