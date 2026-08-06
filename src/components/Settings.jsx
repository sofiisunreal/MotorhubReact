import React, { useEffect, useState } from "react";
import api from "./context/api/api";
import { toast } from "react-toastify";

const Settings = () => {

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
  });

  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });


  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data } = await api.get("core/profile/");
      setProfile(data);

    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      await api.put("core/profile/", profile);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
        "Failed to update profile"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value
    });
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    try {
      const { data } = await api.post(
        "core/change-password/",
        password
      );
      toast.success(data.message);
      setPassword({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach(msg => {
            toast.error(msg);
          });
      } else {
        toast.error("Password update failed");
      }
    } finally {
      setLoadingPassword(false);
    }
  };
  const togglePassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Settings
      </h1>
      {/* PROFILE */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-5">
          Profile Information
        </h2>
        <form onSubmit={updateProfile}>
          <div className="grid md:grid-cols-2 gap-5">
            {
              [
                ["first_name", "First Name"],
                ["last_name", "Last Name"],
                ["username", "Username"],
                ["email", "Email"],
                ["phone_number", "Phone Number"]
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="text-sm text-gray-600">
                    {label}
                  </label>
                  <input
                    name={name}
                    value={profile[name] || ""}
                    onChange={handleProfileChange}
                    className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              ))
            }
          </div>
          <button
            disabled={loadingProfile}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50">
            {
              loadingProfile ? "Saving..." : "Save Profile"
            }
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          Change Password
        </h2>
        <div className="bg-blue-50 p-4 rounded-xl mb-5 text-sm text-blue-700">
          <p className="font-semibold mb-2">
            Password requirements:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>At least 8 characters</li>
            <li>Cannot be too common</li>
            <li>Cannot be entirely numeric</li>
            <li>Should contain a mixture of characters</li>
          </ul>
        </div>
        <form onSubmit={changePassword}>
          {
            [
              ["current_password", "Current Password", "current"],
              ["new_password", "New Password", "new"],
              ["confirm_password", "Confirm Password", "confirm"]
            ].map(([name, label, key]) => (
              <div className="mb-4" key={name}>
                <label className="text-sm text-gray-600">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={
                      showPassword[key] ? "text" : "password"
                    }
                    name={name}
                    value={password[name]}
                    onChange={handlePasswordChange}
                    className="w-full mt-1 border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none" />
                  <button
                    type="button"
                    onClick={() => togglePassword(key)}
                    className="absolute right-3 top-3 text-gray-500">

                    {showPassword[key] ? <i class="bi bi-eye-slash"></i> : <i class="bi bi-eye"></i>}
                  </button>
                </div>
              </div>
            ))
          }

          <button
            disabled={loadingPassword}
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 disabled:opacity-50"  >
            {loadingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-3">
          About MotorHub
        </h2>
        <p className="text-gray-600">
          MotorHub v1.0
        </p>
        <p className="text-gray-600">
          Vehicle Inventory and Sales Management System
        </p>

        <p className="text-sm text-gray-500 mt-3">
          Developed by Sophie Kendi
        </p>
      </div>
    </div>
  )
}
export default Settings;
