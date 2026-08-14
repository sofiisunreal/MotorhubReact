import React, { useEffect, useRef, useState } from "react";
import api from "../context/api/api";
import { toast } from "react-toastify";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);

  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Separate loading states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formRef = useRef(null);

  const FetchSupplier = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("suppliers/viewsuppliers/");
      setSuppliers(data);
    } catch (error) {
      toast.error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchSupplier();
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showForm]);

  // Edit supplier
  const HandleEdit = (supplier) => {
    setEditingId(supplier.id);
    setCompanyName(supplier.company_name || "");
    setContactPerson(supplier.contact_person || "");
    setPhoneNumber(supplier.phone_number || "");
    setEmail(supplier.email || "");
    setAddress(supplier.address || "");
    setShowForm(true);
  };

  // View supplier
  const HandleView = (supplier) => {
    setSelectedSupplier(supplier);
  };

  // Close modal
  const HandleCloseModal = () => {
    setSelectedSupplier(null);
  };

  // Toggle supplier status
  const HandleToggleStatus = async (id, isActive) => {
    const confirmed = window.confirm(
      isActive
        ? "Are you sure you want to deactivate this supplier?"
        : "Are you sure you want to activate this supplier?"
    );

    if (!confirmed) return;

    try {
      await api.patch(`suppliers/${id}/toggle-status/`);

      toast.success(
        isActive
          ? "Supplier deactivated successfully!"
          : "Supplier activated successfully!"
      );

      await FetchSupplier();

      // Update modal data if it is currently open
      if (selectedSupplier?.id === id) {
        setSelectedSupplier((prev) => ({
          ...prev,
          is_active: !isActive,
        }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Something went wrong."
      );
    }
  };

  // Cancel form
  const HandleCancel = () => {
    setCompanyName("");
    setContactPerson("");
    setPhoneNumber("");
    setEmail("");
    setAddress("");

    setEditingId(null);
    setShowForm(false);
  };

  // Submit form
  const HandleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      company_name: companyName,
      contact_person: contactPerson,
      phone_number: phoneNumber,
      email: email,
      address: address,
    };

    setSubmitting(true);

    try {
      if (editingId) {
        await api.patch(
          `suppliers/updatesupplier/${editingId}/`,
          data
        );

        toast.success("Supplier updated successfully!");
      } else {
        await api.post(
          "suppliers/addsupplier/",
          data
        );

        toast.success("Supplier added successfully!");
      }

      HandleCancel();
      await FetchSupplier();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
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

  // Initial loading
  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6 text-gray-500">
        Loading Suppliers...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 px-3 py-4 sm:px-4 md:px-6 space-y-6 overflow-x-hidden">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="min-w-0">
          <h2 className="page-title">
            Suppliers
          </h2>

          <p className="text-sm text-gray-600">
            View and add suppliers
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              HandleCancel();
            } else {
              setShowForm(true);
            }
          }}
          className="btn-primary w-full sm:w-auto"
        >
          <i
            className={`bi ${
              showForm ? "bi-x-lg" : "bi-plus-lg"
            } mr-2`}
          ></i>

          {showForm ? "Close Form" : "Add Supplier"}
        </button>

      </div>


      {/* ================= FORM ================= */}

      {showForm && (
        <div
          ref={formRef}
          className="form-card w-full max-w-full"
        >

          <h2 className="text-lg sm:text-xl font-bold mb-5">
            {editingId ? "Editing Supplier" : "Add Supplier"}
          </h2>

          <form
            onSubmit={HandleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
          >

            {/* Company */}
            <div className="form-group min-w-0">

              <label
                htmlFor="company"
                className="form-label"
              >
                <i className="bi bi-building mr-2"></i>
                Company Name
              </label>

              <input
                id="company"
                type="text"
                className="form-input w-full"
                placeholder="Enter company name"
                value={companyName}
                required
                onChange={(e) =>
                  setCompanyName(e.target.value)
                }
                disabled={submitting}
              />

            </div>


            {/* Contact */}
            <div className="form-group min-w-0">

              <label
                htmlFor="contact"
                className="form-label"
              >
                <i className="bi bi-person mr-2"></i>
                Contact Person
              </label>

              <input
                id="contact"
                type="text"
                required
                className="form-input w-full"
                placeholder="Enter contact person"
                value={contactPerson}
                onChange={(e) =>
                  setContactPerson(e.target.value)
                }
                disabled={submitting}
              />

            </div>


            {/* Phone */}
            <div className="form-group min-w-0">

              <label
                htmlFor="phone"
                className="form-label"
              >
                <i className="bi bi-telephone mr-2"></i>
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                required
                className="form-input w-full"
                placeholder="+254 712 345 678"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value)
                }
                disabled={submitting}
              />

            </div>


            {/* Email */}
            <div className="form-group min-w-0">

              <label
                htmlFor="email"
                className="form-label"
              >
                <i className="bi bi-envelope mr-2"></i>
                Email Address
              </label>

              <input
                id="email"
                type="email"
                required
                className="form-input w-full"
                placeholder="supplier@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={submitting}
              />

            </div>


            {/* Address */}
            <div className="form-group md:col-span-2 min-w-0">

              <label
                htmlFor="address"
                className="form-label"
              >
                <i className="bi bi-geo-alt mr-2"></i>
                Address
              </label>

              <input
                id="address"
                required
                type="text"
                className="form-input w-full"
                placeholder="Enter supplier address"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                disabled={submitting}
              />

            </div>


            {/* Buttons */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">

              <button
                type="submit"
                className="btn-primary w-full sm:w-auto"
                disabled={submitting}
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

                    {editingId ? "Edit" : "Add"}
                  </>
                )}

              </button>


              <button
                onClick={HandleCancel}
                type="button"
                disabled={submitting}
                className="bg-red-200 hover:bg-red-300 py-2 px-5 rounded-lg text-red-600 w-full sm:w-auto disabled:opacity-50"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* ================= SUPPLIER LIST ================= */}

      <div className="form-card w-full max-w-full mt-6 sm:mt-8">

        {/* List Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">

          <h3 className="text-lg sm:text-xl font-bold">
            Supplier List
          </h3>

          <span className="text-sm text-gray-500">
            {suppliers.length} Suppliers
          </span>

        </div>


        {/* ================= MOBILE CARDS ================= */}

        <div className="block md:hidden space-y-3">

          {suppliers.length === 0 ? (

            <div className="text-center py-8 text-gray-500">
              No suppliers found.
            </div>

          ) : (

            suppliers.map((supplier) => (

              <div
                key={supplier.id}
                className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
              >

                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-4">

                  <div className="min-w-0">

                    <h4 className="font-bold text-gray-800 truncate">
                      {supplier.company_name}
                    </h4>

                    <p className="text-sm text-gray-500 truncate">
                      {supplier.contact_person}
                    </p>

                  </div>

                  <StatusBadge
                    status={supplier.is_active}
                  />

                </div>


                {/* Card Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">

                  <div>

                    <p className="text-xs text-gray-400 mb-1">
                      Cars Supplied
                    </p>

                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                      {supplier.cars_supplied}
                    </span>

                  </div>


                  <div className="min-w-0">

                    <p className="text-xs text-gray-400 mb-1">
                      Contact
                    </p>

                    <p className="text-sm font-medium truncate">
                      {supplier.phone_number || "—"}
                    </p>

                  </div>

                </div>


                {/* Card Actions */}
                <div className="flex gap-2 pt-3 border-t">

                  <button
                    onClick={() =>
                      HandleView(supplier)
                    }
                    className="flex-1 border border-blue-200 text-blue-600 hover:bg-blue-50 py-2 rounded-lg font-medium"
                  >
                    <i className="bi bi-eye mr-1"></i>
                    View
                  </button>


                  <button
                    onClick={() =>
                      HandleToggleStatus(
                        supplier.id,
                        supplier.is_active
                      )
                    }
                    className={`px-4 py-2 rounded-lg text-white ${
                      supplier.is_active
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    <i
                      className={`bi ${
                        supplier.is_active
                          ? "bi-building-x"
                          : "bi-building-check"
                      }`}
                    ></i>
                  </button>

                </div>

              </div>

            ))

          )}

        </div>


        {/* ================= DESKTOP TABLE ================= */}

        <div className="hidden md:block overflow-x-auto">

          <table className="w-full min-w-[700px]">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left">
                  Company
                </th>

                <th className="p-3 text-left">
                  Cars Supplied
                </th>

                <th className="p-3 text-left">
                  Contact
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

                <th className="p-3 text-center">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {suppliers.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center p-6 text-gray-500"
                  >
                    No suppliers found.
                  </td>

                </tr>

              ) : (

                suppliers.map((supplier) => (

                  <tr
                    key={supplier.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3 font-medium">
                      {supplier.company_name}
                    </td>

                    <td className="p-3">

                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                        {supplier.cars_supplied}
                      </span>

                    </td>

                    <td className="p-3">
                      {supplier.contact_person}
                    </td>

                    <td className="p-4">
                      <StatusBadge
                        status={supplier.is_active}
                      />
                    </td>

                    <td className="p-3 text-center">

                      <button
                        onClick={() =>
                          HandleView(supplier)
                        }
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <i className="bi bi-eye mr-2"></i>
                        View
                      </button>


                      <button
                        onClick={() =>
                          HandleToggleStatus(
                            supplier.id,
                            supplier.is_active
                          )
                        }
                        className={`ml-4 ${
                          supplier.is_active
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white py-1 px-3 rounded`}
                      >

                        <i
                          className={`bi ${
                            supplier.is_active
                              ? "bi-building-x"
                              : "bi-building-check"
                          }`}
                        ></i>

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= SUPPLIER MODAL ================= */}

      {selectedSupplier && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">

            {/* Modal Header */}
            <div className="flex justify-between items-center border-b p-4 sm:p-5">

              <h2 className="text-lg sm:text-xl font-bold">
                Supplier Details
              </h2>

              <button
                onClick={HandleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>

            </div>


            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">

              <div className="space-y-4">

                {/* Company */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">

                  <span className="text-gray-500">
                    Company
                  </span>

                  <span className="font-semibold sm:text-right break-words">
                    {selectedSupplier.company_name}
                  </span>

                </div>


                {/* Contact Person */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">

                  <span className="text-gray-500">
                    Contact
                  </span>

                  <span className="font-semibold sm:text-right break-words">
                    {selectedSupplier.contact_person}
                  </span>

                </div>


                {/* Phone */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">

                  <span className="text-gray-500">
                    Phone
                  </span>

                  <span className="font-semibold sm:text-right break-words">
                    {selectedSupplier.phone_number}
                  </span>

                </div>


                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">

                  <span className="text-gray-500">
                    Email
                  </span>

                  <span className="font-semibold sm:text-right break-all">
                    {selectedSupplier.email}
                  </span>

                </div>


                {/* Address */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">

                  <span className="text-gray-500">
                    Address
                  </span>

                  <span className="font-semibold sm:text-right break-words">
                    {selectedSupplier.address}
                  </span>

                </div>


                {/* Cars Supplied */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">

                  <span className="text-gray-500">
                    Cars Supplied
                  </span>

                  <span>

                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {selectedSupplier.cars_supplied}
                    </span>

                  </span>

                </div>


                {/* Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">

                  <span className="text-gray-500">
                    Status
                  </span>

                  <span>
                    <StatusBadge
                      status={selectedSupplier.is_active}
                    />
                  </span>

                </div>

              </div>


              {/* Modal Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 border-t">

                <button
                  onClick={() => {
                    HandleEdit(selectedSupplier);
                    HandleCloseModal();
                  }}
                  className="btn-primary w-full sm:w-auto"
                >
                  <i className="bi bi-pencil-square mr-2"></i>
                  Edit
                </button>


                <button
                  onClick={() =>
                    HandleToggleStatus(
                      selectedSupplier.id,
                      selectedSupplier.is_active
                    )
                  }
                  className={`${
                    selectedSupplier.is_active
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white px-4 py-2 rounded-lg w-full sm:w-auto`}
                >
                  {selectedSupplier.is_active
                    ? "Deactivate"
                    : "Activate"}
                </button>


                <button
                  onClick={HandleCloseModal}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Supplier;