import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const DashboardNav = ({ onMenuClick }) => {
  const { user, Logout } = useContext(AuthContext);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">

        {/* Left Side */}
        <div className="flex items-center gap-5">

          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="md:hidden text-2xl text-gray-700 hover:text-red-600 transition"
          >
            <i className="bi bi-list"></i>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-blue-700 text-white flex items-center justify-center shadow-md">
              <i className="bi bi-car-front-fill text-lg"></i>
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-800">
                MotorHub
              </h1>

              <p className="text-sm text-gray-500">
                Staff Dashboard
              </p>
            </div>
          </div>

        </div>

        {/* Centre */}
        <div className="hidden lg:block text-center">
          <p className="text-sm font-semibold text-gray-800">
            Welcome back, {user?.first_name || user?.username}! 👋
          </p>

          <p className="text-xs text-gray-500">
            {today}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="hidden xl:flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <i className="bi bi-search text-gray-400"></i>

            <input
              type="text"
              placeholder="Search vehicles..."
              className="bg-transparent outline-none ml-2 text-sm w-48"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
            <i className="bi bi-bell text-xl text-gray-600"></i>

            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User */}
          <div className="hidden sm:flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-blue-700 text-white flex items-center justify-center font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user?.first_name || user?.username}
              </p>

              <span className="inline-block mt-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium capitalize">
                {user?.role}
              </span>
            </div>

          </div>

          {/* Logout */}
          <button
            onClick={Logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition"
          >
            <i className="bi bi-box-arrow-right"></i>

            <span className="hidden md:inline">
              Logout
            </span>
          </button>

        </div>

      </div>
    </nav>
  );
};

export default DashboardNav;
