import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SideBar = ({ isOpen, setIsOpen }) => {
  const { user, Logout } = useContext(AuthContext)
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
      ? "bg-white text-red-700 font-semibold shadow-lg"
      : "text-gray-200 hover:bg-white/20 hover:translate-x-1 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-slate-900 via-red-700 to-blue-900 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Mobile Close Button */}
        <button
          className="absolute top-4 right-4 md:hidden text-white text-2xl"
          onClick={() => setIsOpen(false)}
        >
          <i className="bi bi-x-lg"></i>
        </button>

        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <img
                src="/motorhub.png"
                alt="Motorhub"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-2xl text-white font-bold">MotorHub</h2>
              <p className="text-sm text-gray-200">Staff Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <p className="text-xs uppercase tracking-widest text-gray-300 mb-3">
            Main Menu
          </p>

          <nav className="space-y-2">
            <NavLink
              to="/staff-dashboard"
              end
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-speedometer2"></i>
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/staff-dashboard/cars"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <i class="bi bi-car-front-fill"></i>
              <span>View Cars</span>
            </NavLink>

            <NavLink
              to="/staff-dashboard/sales"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-wallet2"></i>
              <span>Your Sales</span>
            </NavLink>

            <NavLink
              to="/staff-dashboard/notices"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-megaphone"></i>
              <span>Notices</span>
            </NavLink>




          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto border-t border-white/20 p-6 space-y-2">
          <NavLink
            to="settings"
            className={linkClass}
            onClick={() => setIsOpen(false)}
          >
            <i className="bi bi-gear-fill"></i>
            <span>Settings</span>
          </NavLink>

          <button onClick={Logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-200 hover:bg-red-600 transition-all duration-300">
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
