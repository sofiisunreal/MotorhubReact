import React, { useState } from "react";
import api from "../context/api/api";

const Supplier = () => {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const HandleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    if (
      !companyName ||
      !contactPerson ||
      !phoneNumber ||
      !email ||
      !address
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const data = {
      company_name: companyName,
      contact_person: contactPerson,
      phone_number: phoneNumber,
      email,
      address,
    };

    try {
      const res = await api.post("suppliers/addsupplier/", data);

      setMessage(`${res.data.message} for ${res.data.supplier}`);

      setCompanyName("");
      setContactPerson("");
      setPhoneNumber("");
      setEmail("");
      setAddress("");
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

      <h2 className="page-title">
        Add Supplier
      </h2>

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

      <div className="form-card">

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
              <i className="bi bi-plus-circle mr-2"></i>

              {loading ? "Saving Supplier..." : "Add Supplier"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Supplier;
