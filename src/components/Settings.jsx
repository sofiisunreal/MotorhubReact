import React, { useEffect, useState } from "react";
import api from "./context/api/api";
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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    getProfile();
  }, []);


  const getProfile = async () => {
    try {
      const response = await api.get("core/profile/");
      setProfile(response.data);

    } catch (error) {
      console.log(error);
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

    try {
      const response = await api.put("core/profile/",profile);
      setMessage(response.data.message);
      setError("");

    } catch (error) {
      setError("Failed to update profile");
      setMessage("");
    }
  };


  // Password input
  const handlePasswordChange = (e) => {setPassword({...password,[e.target.name]: e.target.value });
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/core/change-password/",
        password
      );
      setMessage(response.data.message);
      setError("");

      setPassword({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });


    } catch (error) {
      setError(
        error.response?.data?.error ||
        "Password update failed"
      );

      setMessage("");
    }
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Settings
      </h1>


      {/* Messages */}
      {message && (
        <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}



      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">

        <h2 className="text-xl font-bold mb-5">
          Profile Information
        </h2>


        <form onSubmit={updateProfile}>

          <div className="grid md:grid-cols-2 gap-4">


            <input
              name="first_name"
              value={profile.first_name}
              onChange={handleProfileChange}
              placeholder="First Name"
              className="border p-3 rounded-lg"
            />


            <input
              name="last_name"
              value={profile.last_name}
              onChange={handleProfileChange}
              placeholder="Last Name"
              className="border p-3 rounded-lg"
            />


            <input
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              placeholder="Username"
              className="border p-3 rounded-lg"
            />


            <input
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="Email"
              className="border p-3 rounded-lg"
            />
            <input
              name="phone_number"
              value={profile.phone_number || ""}
              onChange={handleProfileChange}
              placeholder="Phone Number"
              className="border p-3 rounded-lg"
            />
          </div>
          <button
            className="mt-5 bg-gradient-to-r from-red-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Password Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">

        <h2 className="text-xl font-bold mb-5">
          Change Password
        </h2>


        <form onSubmit={changePassword}>


          <div className="space-y-4">


            <input
              type="password"
              name="current_password"
              value={password.current_password}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="w-full border p-3 rounded-lg"
            />


            <input type="password" name="new_password"  value={password.new_password} onChange={handlePasswordChange}  placeholder="New Password" className="w-full border p-3 rounded-lg" />

            <input type="password" name="confirm_password" value={password.confirm_password} onChange={handlePasswordChange} placeholder="Confirm Password"
              className="w-full border p-3 rounded-lg"
            />
          </div>
          <button
            className="mt-5 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Update Password
          </button>


        </form>

      </div>
      {/* About */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-3">
          About MotorHub
        </h2>


        <p className="text-gray-600">
          MotorHub v1.0
        </p>

        <p className="text-gray-600">
          Vehicle Inventory and Sales Management System
        </p>

        <p className="text-gray-500 text-sm mt-2">
          Developed by Sophie Kendi
        </p>

      </div>


    </div>
  );
};


export default Settings;
