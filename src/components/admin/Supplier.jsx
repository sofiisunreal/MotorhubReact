import React, { useEffect, useRef, useState } from "react";
import api from "../context/api/api";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([])
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const formRef = useRef(null);

  const FetchSupplier = async () => {

    setLoading(true);

    try {

      const { data } = await api.get(
        "suppliers/viewsuppliers/"
      );

      setSuppliers(data);

    } catch (error) {

      console.log(error);

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
  };  // cancel
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
    try {
      let res;
      if (editingId) {
        res = await api.patch(
          `suppliers/updatesupplier/${editingId}/`,
          data
        );
      } else {
        res = await api.post(
          "suppliers/addsupplier/",
          data
        );
      }
      setCompanyName("");
      setContactPerson("");
      setPhoneNumber("");
      setEmail("");
      setAddress("");
      setMessage(`${res.data.message}`);
      HandleCancel();
      FetchSupplier();
    } catch (error) {
      setError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };
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
        {message && (
          <div className="alert-success">
            {message}
          </div>
        )}

        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}
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

        <div className="flex justify-between items-center mb-6">

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

                <th className="p-3 text-left">Contact</th>

                <th className="p-3 text-left">Phone</th>

                <th className="p-3 text-left">Email</th>

                <th className="p-3 text-left">Address</th>

                <th className="p-3 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {suppliers.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
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
                      {supplier.contact_person}
                    </td>

                    <td className="p-3">
                      {supplier.phone_number}
                    </td>

                    <td className="p-3">
                      {supplier.email}
                    </td>

                    <td className="p-3">
                      {supplier.address}
                    </td>

                    <td className="p-3 text-center">

                      <button
                        onClick={() => HandleEdit(supplier)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <i className="bi bi-pencil-square mr-2"></i>

                        Edit

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div >
  );
};

export default Supplier;
