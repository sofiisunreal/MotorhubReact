import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "./context/api/api";

const RequestQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    message: "",
  });

  const fetchCar = async () => {
    try {
      const { data } = await api.get(`cars/view_car/${id}/`);
      setCar(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vehicle");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("quotes/request/", {
        car: id,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email,
        message: form.message,
      });

      toast.success("Quote request submitted successfully!");
      setForm({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        message: "",
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit quote request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
          <p className="mt-3 text-sm text-slate-500">
            Loading vehicle...
          </p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <i className="bi bi-car-front text-2xl" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Vehicle not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white">
              <i className="bi bi-car-front-fill" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900">
                Motorhub
              </p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                Automotive
              </p>
            </div>
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-sm font-semibold text-slate-500 transition hover:text-blue-700"
          >
            <i className="bi bi-arrow-left mr-1" />
            Back to inventory
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600">
            Request a quote
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Interested in this vehicle?
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Fill in your details and our team will get back to you.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Car */}
          <div className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-64 bg-slate-100">
              {car.image ? (
                <img
                  src={car.image}
                  alt={car.brand}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">
                  <i className="bi bi-car-front text-6xl" />
                </div>
              )}
              <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
                Available
              </span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {car.brand}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {car.year}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs text-slate-400">
                    Year
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {car.year}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-blue-50 p-4">
                <div className="flex gap-3">
                  <i className="bi bi-info-circle-fill mt-0.5 text-blue-700" />
                  <p className="text-xs leading-5 text-blue-800">
                    Submit your details and our team will contact you
                    regarding this vehicle and provide further pricing
                    information.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Your details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tell us how we can reach you.
              </p>
            </div>
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Full name
                </label>

                <input
                  type="text"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={form.customer_phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 0712345678"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
              </div>
              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={form.customer_email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
              </div>
              {/* Message */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Message
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us anything you'd like to know about this vehicle..."
                  className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
              </div>
              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <i className="bi bi-arrow-repeat animate-spin" />
                    Sending request...
                  </>
                ) : (
                  <>
                    Request a Quote
                    <i className="bi bi-arrow-right" />
                  </>
                )}
              </button>
              <p className="text-center text-xs leading-5 text-slate-400">By submitting this form, you're requesting informationabout the selected vehicle. Our team will contact you using the details provided.
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
export default RequestQuote;
