import React, { useRef, useState, useEffect } from "react";
import api from "../context/api/api";

const Staff = () => {
  const [staff, setStaff] = useState([]);

  const [username, setUserName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("staff");
  const [password, setPassword] = useState("1234");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const formRef = useRef(null);

  const FetchStaff = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("core/staff/");
      setStaff(data);
    } catch (error) {
      console.log(error);
      setError("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchStaff();
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showForm]);

  const HandleCancelEdit = () => {
    setEditingId(null);
    setShowForm(false);

    setUserName("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setRole("staff");
    setPassword("1234");

    setError("");
    setMessage("");
  };

  const HandleToggleForm = () => {
    if (showForm) {
      HandleCancelEdit();
    } else {
      setError("");
      setMessage("");
      setShowForm(true);
    }
  };

  const HandleEdit = (member) => {
    setEditingId(member.id);

    setUserName(member.username || "");
    setFirstName(member.first_name || "");
    setLastName(member.last_name || "");
    setEmail(member.email || "");
    setPhoneNumber(member.phone_number || "");
    setRole(member.role || "staff");

    setError("");
    setMessage("");
    setShowForm(true);
  };

  const HandleToggleStatus = async (id, isActive) => {
    const confirmed = window.confirm(
      isActive
        ? "Are you sure you want to deactivate this staff member?"
        : "Are you sure you want to activate this staff member?"
    );

    if (!confirmed) return;

    try {
      await api.patch(`core/staff/${id}/toggle-status/`);

      await FetchStaff();
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update staff status"
      );
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setMessage("");

    const data = {
      username,
      first_name: firstname,
      last_name: lastname,
      email,
      phone_number: phonenumber,
      role,
    };

    // Only send password when creating a new account
    if (!editingId) {
      data.password = password;
    }

    try {
      let res;

      if (editingId) {
        res = await api.patch(
          `core/staff/${editingId}/`,
          data
        );
      } else {
        res = await api.post(
          "core/register/",
          data
        );
      }

      setMessage(
        res.data?.message ||
          (editingId
            ? "Staff member updated"
            : "Staff member added")
      );

      await FetchStaff();

      setTimeout(() => {
        HandleCancelEdit();
      }, 500);
    } catch (error) {
      console.error("Error submitting form:", error);

      const resData = error.response?.data;

      setError(
        resData
          ? JSON.stringify(resData)
          : "Failed to submit form"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const RoleBadge = ({ role }) => {
    const styles = {
      admin: "bg-purple-100 text-purple-700",
      staff: "bg-blue-100 text-blue-700",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold capitalize whitespace-nowrap ${
          styles[role] ||
          "bg-gray-100 text-gray-700"
        }`}
      >
        {role}
      </span>
    );
  };

  const StatusBadge = ({ status }) => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${
          status
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {status ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className="w-full min-w-0 px-3 py-4 sm:px-4 md:px-6 space-y-6 overflow-x-hidden">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="min-w-0">

          <h1 className="text-2xl font-bold mb-1">
            Staff Management
          </h1>

          <p className="text-gray-600 text-sm sm:text-base">
            Manage your staff members
          </p>

        </div>

        <button
          onClick={HandleToggleForm}
          className="btn-primary w-full sm:w-auto text-white font-bold py-2 px-4 rounded"
        >
          <i
            className={`bi ${
              showForm
                ? "bi-x-lg"
                : "bi-plus-lg"
            } mr-2`}
          ></i>

          {showForm
            ? "Close Form"
            : "Add Staff Member"}
        </button>

      </div>


      {/* ================= FORM ================= */}

      {showForm && (
        <div
          ref={formRef}
          className="form-card w-full max-w-full"
        >

          <h2 className="text-lg sm:text-xl font-bold mb-5">
            {editingId
              ? "Edit Staff Member"
              : "Add Staff Member"}
          </h2>

          <form
            onSubmit={HandleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >

            {/* Username */}
            <div className="min-w-0">

              <label
                className="form-label"
                htmlFor="username"
              >
                Username
              </label>

              <input
                className="form-input w-full"
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) =>
                  setUserName(e.target.value)
                }
                disabled={submitting}
                placeholder="Enter username"
              />

            </div>


            {/* First Name */}
            <div className="min-w-0">

              <label
                className="form-label"
                htmlFor="firstname"
              >
                First Name
              </label>

              <input
                className="form-input w-full"
                id="firstname"
                type="text"
                required
                value={firstname}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
                disabled={submitting}
                placeholder="Enter first name"
              />

            </div>


            {/* Last Name */}
            <div className="min-w-0">

              <label
                className="form-label"
                htmlFor="lastname"
              >
                Last Name
              </label>

              <input
                className="form-input w-full"
                id="lastname"
                type="text"
                required
                value={lastname}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
                disabled={submitting}
                placeholder="Enter last name"
              />

            </div>


            {/* Email */}
            <div className="min-w-0">

              <label
                className="form-label"
                htmlFor="email"
              >
                Email
              </label>

              <input
                className="form-input w-full"
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={submitting}
                placeholder="staff@example.com"
              />

            </div>


            {/* Phone */}
            <div className="min-w-0">

              <label
                className="form-label"
                htmlFor="phonenumber"
              >
                Phone Number
              </label>

              <input
                className="form-input w-full"
                id="phonenumber"
                type="tel"
                required
                value={phonenumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value)
                }
                disabled={submitting}
                placeholder="+254 712 345 678"
              />

            </div>


            {/* Role */}
            <div className="min-w-0">

              <label
                className="form-label"
                htmlFor="role"
              >
                Role
              </label>

              <select
                className="form-input w-full"
                id="role"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                disabled={submitting}
              >
                <option value="staff">
                  Staff
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>

            </div>


            {/* Password */}
            {!editingId && (
              <div className="min-w-0">

                <label
                  className="form-label"
                  htmlFor="password"
                >
                  Temporary Password
                </label>

                <input
                  className="form-input w-full"
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  disabled={submitting}
                  placeholder="Enter temporary password"
                />

              </div>
            )}


            {/* Buttons */}
            <div className="lg:col-span-3 flex flex-col sm:flex-row gap-3 mt-2">

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full sm:w-auto disabled:opacity-60"
              >

                {submitting ? (
                  <>
                    <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i
                      className={`bi ${
                        editingId
                          ? "bi-pencil-square"
                          : "bi-plus-circle"
                      } mr-2`}
                    ></i>

                    {editingId
                      ? "Update Staff Member"
                      : "Add Staff Member"}
                  </>
                )}

              </button>


              <button
                type="button"
                onClick={HandleCancelEdit}
                disabled={submitting}
                className="btn-secondary w-full sm:w-auto"
              >
                Cancel
              </button>

            </div>


            {/* Messages */}
            {message && (
              <div className="alert-success lg:col-span-3 break-words">
                {message}
              </div>
            )}

            {error && (
              <div className="alert-error lg:col-span-3 break-words">
                {error}
              </div>
            )}

          </form>

        </div>
      )}


      {/* ================= STAFF LIST ================= */}

      {loading ? (

        <div className="text-gray-500">
          Loading staff...
        </div>

      ) : staff.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No staff members yet
        </div>

      ) : (

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {/* ================= MOBILE CARDS ================= */}

          <div className="block md:hidden p-3 space-y-3">

            {staff.map((member) => {

              const initials =
                `${member.first_name?.[0] || ""}${member.last_name?.[0] || ""}`
                  .toUpperCase();

              return (

                <div
                  key={member.id}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm"
                >

                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                        {initials || "S"}
                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold text-gray-800 truncate">
                          {member.first_name}{" "}
                          {member.last_name}
                        </p>

                        <p className="text-sm text-gray-500 truncate">
                          @{member.username}
                        </p>

                      </div>

                    </div>

                    <StatusBadge
                      status={member.is_active}
                    />

                  </div>


                  {/* Card Information */}
                  <div className="grid grid-cols-2 gap-4 mt-4">

                    <div className="min-w-0">

                      <p className="text-xs text-gray-400 mb-1">
                        Email
                      </p>

                      <p className="text-sm font-medium break-all">
                        {member.email || "—"}
                      </p>

                    </div>


                    <div className="min-w-0">

                      <p className="text-xs text-gray-400 mb-1">
                        Phone
                      </p>

                      <p className="text-sm font-medium break-words">
                        {member.phone_number || "—"}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-gray-400 mb-1">
                        Role
                      </p>

                      <RoleBadge
                        role={member.role}
                      />

                    </div>

                  </div>


                  {/* Card Actions */}
                  <div className="flex gap-2 mt-4 pt-3 border-t">

                    <button
                      onClick={() =>
                        HandleEdit(member)
                      }
                      className="flex-1 btn-primary py-2"
                    >
                      <i className="bi bi-pencil-square mr-1"></i>
                      Edit
                    </button>


                    <button
                      onClick={() =>
                        HandleToggleStatus(
                          member.id,
                          member.is_active
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-white ${
                        member.is_active
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                      aria-label={
                        member.is_active
                          ? `Deactivate ${member.username}`
                          : `Activate ${member.username}`
                      }
                    >
                      <i
                        className={`bi ${
                          member.is_active
                            ? "bi-person-x"
                            : "bi-person-check"
                        }`}
                      ></i>
                    </button>

                  </div>

                </div>

              );
            })}

          </div>


          {/* ================= DESKTOP TABLE ================= */}

          <div className="hidden md:block overflow-x-auto">

            <table className="w-full min-w-[800px] text-left">

              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">

                <tr>

                  <th className="p-4">
                    Staff
                  </th>

                  <th className="p-4">
                    Contact
                  </th>

                  <th className="p-4">
                    Role
                  </th>

                  <th className="p-4">
                    Status
                  </th>

                  <th className="p-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y">

                {staff.map((member) => {

                  const initials =
                    `${member.first_name?.[0] || ""}${member.last_name?.[0] || ""}`
                      .toUpperCase();

                  return (

                    <tr
                      key={member.id}
                      className="hover:bg-gray-50"
                    >

                      {/* Staff */}
                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                            {initials || "S"}
                          </div>

                          <div className="min-w-0">

                            <p className="font-semibold">
                              {member.first_name}{" "}
                              {member.last_name}
                            </p>

                            <p className="text-sm text-gray-500">
                              @{member.username}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Contact */}
                      <td className="p-4">

                        <p className="break-all">
                          {member.email || "—"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {member.phone_number || "—"}
                        </p>

                      </td>


                      {/* Role */}
                      <td className="p-4">

                        <RoleBadge
                          role={member.role}
                        />

                      </td>


                      {/* Status */}
                      <td className="p-4">

                        <StatusBadge
                          status={member.is_active}
                        />

                      </td>


                      {/* Actions */}
                      <td className="p-4 text-right">

                        <button
                          onClick={() =>
                            HandleEdit(member)
                          }
                          className="btn-primary text-white font-bold py-1 px-3 rounded"
                          aria-label={`Edit ${member.username}`}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>


                        <button
                          onClick={() =>
                            HandleToggleStatus(
                              member.id,
                              member.is_active
                            )
                          }
                          className={`ml-2 ${
                            member.is_active
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white font-bold py-1 px-3 rounded`}
                        >
                          <i
                            className={`bi ${
                              member.is_active
                                ? "bi-person-x"
                                : "bi-person-check"
                            }`}
                          ></i>
                        </button>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default Staff;