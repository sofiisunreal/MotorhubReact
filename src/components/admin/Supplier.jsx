import React, { useEffect, useRef, useState } from "react";
import api from "../context/api/api";
import { toast } from "react-toastify";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([])
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedSupplier, setSelectedSupplier] = useState(null)

  const [loading, setLoading] = useState(false);

  const formRef = useRef(null);

  const FetchSupplier = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        "suppliers/viewsuppliers/"
      );
      setSuppliers(data);
    } catch (error) {
      toast.error("Failed to fetch suppliers")
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    FetchSupplier();
  }, []);
  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showForm])

  if (loading) return (<>
    <p className='p-6 text-gray-500'>Loading Suppliers...</p>
  </>
  )

  // edit suppliers
  const HandleEdit = (supplier) => {
    console.log("Editing:", supplier);

    setEditingId(supplier.id);
    setCompanyName(supplier.company_name);
    setContactPerson(supplier.contact_person);
    setPhoneNumber(supplier.phone_number);
    setEmail(supplier.email);
    setAddress(supplier.address);
    setShowForm(true);
  };
  const HandleView = (supplier) => {
    setSelectedSupplier(supplier)
  }
  const HandleCloseModal = () => {
    setSelectedSupplier(null)
  }


  const HandleToggleStatus = async (id, isActive) => {
    const confirmed = window.confirm(
      isActive
        ? "Are you sure you want to deactivate this supplier?"
        : "Are you sure you want to activate this supplier?"
    )

    if (!confirmed) return
    try {
      await api.patch(`suppliers/${id}/toggle-status/`);

      toast.success(
        isActive
          ? "Supplier deactivated successfully!"
          : "Supplier activated successfully!"
      );

      FetchSupplier();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong."
      );
    }  
  }
    // cancel
    const HandleCancel = () => {

      setCompanyName("");
      setContactPerson("");
      setPhoneNumber("");
      setEmail("");
      setAddress("");

      setEditingId(null);

      setShowForm(false);
    };
    const HandleSubmit = async (e) => {
      e.preventDefault();

      const data = {
        company_name: companyName,
        contact_person: contactPerson,
        phone_number: phoneNumber,
        email: email,
        address: address,
      };

      setLoading(true);

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

        setTimeout(() => {
          window.location.reload();
        }, 1000);

      } catch (error) {
        toast.error(
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Something went wrong."
        );

        setLoading(false);
      }
    };
    const StatusBadge = ({ status }) => {
      return (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${status
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {status ? "Active" : "Inactive"}
        </span>
      )
    }
    return (
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>

            <h2 className="page-title">
              Suppliers
            </h2>
            <p>View and add suppliers</p>
          </div>
          <button
            onClick={() => {
              if (showForm) {
                HandleCancel();
              } else {
                setShowForm(true);
              }
            }}
            className="btn-primary mb-6"
          >
            <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"} mr-2`}></i>

            {showForm ? "Close Form" : "Add Supplier"}
          </button>
        </div>


        {/* form here */}
        {showForm && (
          <div ref={formRef} className="form-card max-w-full">
            <h2>{editingId ? "Editing" : "Add Supplier"}</h2>


            <form onSubmit={HandleSubmit} className="form-grid">

              <div className="form-group">
                <label htmlFor="company" className="form-label">
                  <i className="bi bi-building mr-2"></i>
                  Company Name
                </label>

                <input
                  id="company"
                  type="text"
                  className="form-input"
                  placeholder="Enter company name"
                  value={companyName}
                  required
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact" className="form-label">
                  <i className="bi bi-person mr-2"></i>
                  Contact Person
                </label>

                <input
                  id="contact"
                  type="text"
                  required

                  className="form-input"
                  placeholder="Enter contact person"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <i className="bi bi-telephone mr-2"></i>
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  required
                  className="form-input"
                  placeholder="+254 712 345 678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <i className="bi bi-envelope mr-2"></i>
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="supplier@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="address" className="form-label">
                  <i className="bi bi-geo-alt mr-2"></i>
                  Address
                </label>

                <input
                  id="address"
                  required
                  type="text"
                  className="form-input"
                  placeholder="Enter supplier address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="full-width">

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >

                  <i
                    className={`bi ${editingId ? "bi-pencil-square" : "bi-plus-circle"} mr-2`}
                  ></i>

                  {editingId ? "Edit" : "Add"}
                </button>
                <button
                  onClick={HandleCancel}
                  type="button"
                  className="bg-red-200 hover:bg-red-300 py-2 px-5 rounded-lg text-red-500 ml-3"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div >
        )}
        <div className="form-card  max-w-full mt-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold">
              Supplier List
            </h3>

            <span className="text-gray-500">
              {suppliers.length} Suppliers
            </span>

          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3 text-left">Cars Supplied</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Action</th>
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
                      <td className="p-3">
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
                        <StatusBadge status={supplier.is_active} />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => HandleView(supplier)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <i className="bi bi-eye mr-2"></i>
                          View
                        </button>
                        <button
                          onClick={() => HandleToggleStatus(supplier.id, supplier.is_active)}
                          className={`ml-4 ${supplier.is_active
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                            } text-white py-1 px-3 rounded`}
                        >
                          <i
                            className={`bi ${supplier.is_active
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
        {selectedSupplier && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

              {/* Header */}
              <div className="flex justify-between items-center border-b p-5">
                <h2 className="text-xl font-bold">Supplier Details</h2>

                <button
                  onClick={HandleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">

                <div className="grid grid-cols-2 gap-y-4">

                  <span className="text-gray-500">Company</span>
                  <span className="font-semibold text-right">
                    {selectedSupplier.company_name}
                  </span>

                  <span className="text-gray-500">Contact</span>
                  <span className="font-semibold text-right">
                    {selectedSupplier.contact_person}
                  </span>

                  <span className="text-gray-500">Phone</span>
                  <span className="font-semibold text-right">
                    {selectedSupplier.phone_number}
                  </span>

                  <span className="text-gray-500">Email</span>
                  <span className="font-semibold text-right break-all">
                    {selectedSupplier.email}
                  </span>

                  <span className="text-gray-500">Address</span>
                  <span className="font-semibold text-right">
                    {selectedSupplier.address}
                  </span>

                  <span className="text-gray-500">Cars Supplied</span>
                  <span className="text-right">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {selectedSupplier.cars_supplied}
                    </span>
                  </span>

                  <span className="text-gray-500">Status</span>
                  <span className="text-right">
                    <StatusBadge status={selectedSupplier.is_active} />
                  </span>

                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">

                  <button
                    onClick={() => {
                      HandleEdit(selectedSupplier);
                      HandleCloseModal()
                    }}
                    className="btn-primary"
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
                    className={`${selectedSupplier.is_active
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                      } text-white px-4 py-2 rounded-lg`}
                  >
                    {selectedSupplier.is_active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={HandleCloseModal}
                    className="btn-secondary"
                  >
                    Close
                  </button>

                </div>

              </div>

            </div>
          </div>
        )}

      </div >
    );
  };

  export default Supplier;
