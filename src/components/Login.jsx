import React, { useContext, useState } from "react";
import api from "./context/api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const Login = () => {
  const { setToken, setUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const data = {
      username,
      password,
    };

    try {
      const response = await api.post("core/login/", data);

      console.log("Response:", response);

      const { access, refresh, user } = response.data;

      // Get user information from backend response
      const userData = {
        username: user.username,
        role: user.role,
      };

      // Save in context
      setToken(access);
      setUser(userData);

      // Save in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(userData));


      // Role based navigation
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "staff") {
        navigate("/staff-dashboard");
      } else {
        navigate("/not-authorized");
      }


    } catch (error) {
      setLoading(false)
      console.log(error.response);
      setError(error.response?.data?.detail || "Login failed");
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-red-600 flex items-center justify-center p-4">

      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8"
      >

        {/* Back to Home */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
        >
          <i className="bi bi-arrow-left" />
          Back to Home
        </button>



        {/* Logo */}
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full">
            <img
              src="/motorhub.png"
              alt="Motorhub"
              className="h-full w-full object-cover"
            />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Motorhub
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Find your next drive
          </p>
        </div>


        {/* Error */}
        {
          error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )
        }


        {/* Username */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>


        {/* Password */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>


        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form >

    </div >
  );
};

export default Login;
