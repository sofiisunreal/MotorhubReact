import React, { useState, useEffect } from "react";
import api from "../context/api/api";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/400x250?text=No+Image";

const formatKsh = (amount) =>
  `Ksh ${Number(amount || 0).toLocaleString()}`;

const formatDate = (iso) => {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSale, setSelectedSale] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [vinNumber, setVinNumber] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const FetchSales = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("sales/viewsales/");
      setSales(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchSales();
  }, []);

  const HandleView = (sale) => {
    setSelectedSale(sale);
    setIsEditing(false);
    setError("");
    setMessage("");
  };

  const HandleCloseModal = () => {
    setSelectedSale(null);
    setIsEditing(false);
    setError("");
    setMessage("");
  };

  const HandleStartEdit = () => {
    setCustomerName(selectedSale.customer_name || "");
    setCustomerPhone(selectedSale.customer_phone || "");
    setSellingPrice(selectedSale.selling_price ?? "");
    setVinNumber(selectedSale.vin_number || "");

    setIsEditing(true);
    setError("");
    setMessage("");
  };

  const HandleExport = async () => {
    try {
      const response = await api.get("sales/exportsalescsv/", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = url;
      link.download = "sales_report.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const HandleEditSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      await api.patch(
        `sales/update-sale/${selectedSale.sale_id}/`,
        {
          customer_name: customerName,
          customer_phone: customerPhone,
          selling_price: sellingPrice,
          vin_number: vinNumber,
        }
      );

      setMessage("Sale updated successfully");

      setIsEditing(false);

      await FetchSales();

      // Find updated sale and keep modal open
      const updatedSales = await api.get("sales/viewsales/");

      const updatedSale = updatedSales.data.find(
        (sale) => sale.sale_id === selectedSale.sale_id
      );

      if (updatedSale) {
        setSelectedSale(updatedSale);
      }
    } catch (error) {
      const resData = error.response?.data;

      setError(
        resData
          ? JSON.stringify(resData)
          : "Failed to update sale"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Sales
          </h1>

          <p className="text-gray-600">
            All recorded sales
          </p>
        </div>

        <button
          onClick={HandleExport}
          className="btn-primary w-full sm:w-auto"
        >
          <i className="bi bi-download mr-2"></i>
          Export Sales CSV
        </button>
      </div>

      {message && (
        <div className="alert-success">
          {message}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-500">
          Loading sales...
        </p>
      ) : sales.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <i className="bi bi-receipt text-4xl text-gray-300"></i>

          <p className="text-gray-500 mt-3">
            No sales recorded yet
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Payment Status</th>
                    <th className="p-4">Profit</th>
                    <th className="p-4">Staff</th>
                    <th className="p-4 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {sales.map((sale) => {
                    const profit = Number(sale.profit);

                    return (
                      <tr
                        key={sale.sale_id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 font-medium">
                          #{sale.sale_id}
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-semibold">
                            {sale.brand}
                          </p>

                          <p className="text-sm text-gray-500">
                            {sale.vin_number}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-medium">
                            {sale.customer_name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {sale.customer_phone}
                          </p>
                        </td>
                        <td class="px-4 py-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${sale.payment_status === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {sale.payment_status === "paid" ? "Paid" : "Partial"}
                          </span>
                        </td>


                        <td
                          className={`px-4 py-4 font-semibold ${profit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                        >
                          {formatKsh(profit)}
                        </td>

                        <td className="px-4 py-4">
                          {sale.sold_by}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => HandleView(sale)}
                            className="text-blue-600 hover:text-blue-800 font-semibold whitespace-nowrap"
                          >
                            <i className="bi bi-eye mr-1"></i>
                            View More
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-4">
            {sales.map((sale) => {
              const profit = Number(sale.profit);

              return (
                <div
                  key={sale.sale_id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                >
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Sale #{sale.sale_id}
                      </p>

                      <h2 className="text-lg font-bold text-gray-800 truncate">
                        {sale.brand}
                      </h2>
                    </div>

                    <span className="shrink-0 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Completed
                    </span>
                  </div>

                  {/* VEHICLE */}
                  <div className="mt-4 bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      VIN
                    </p>

                    <p className="font-semibold text-gray-800 break-all">
                      {sale.vin_number}
                    </p>
                  </div>

                  {/* CUSTOMER */}
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Customer
                    </p>

                    <p className="font-semibold text-gray-800">
                      {sale.customer_name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {sale.customer_phone}
                    </p>
                  </div>

                  {/* BOTTOM INFO */}
                  <div className="mt-4 flex items-center justify-between gap-4 border-t pt-4">
                    <div>
                      <p className="text-xs text-gray-500">
                        Profit
                      </p>

                      <p
                        className={`font-bold ${profit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {formatKsh(profit)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Sold by
                      </p>

                      <p className="font-medium text-gray-700">
                        {sale.sold_by}
                      </p>
                    </div>
                  </div>

                  {/* VIEW */}
                  <button
                    onClick={() => HandleView(sale)}
                    className="mt-4 w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-2.5 rounded-xl font-semibold transition"
                  >
                    <i className="bi bi-eye mr-2"></i>
                    View More
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* MODAL */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[92vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-4 sm:p-5 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold truncate pr-4">
                {isEditing
                  ? "Edit Sale"
                  : `${selectedSale.brand} — Sale #${selectedSale.sale_id}`}
              </h2>

              <button
                onClick={HandleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none shrink-0"
              >
                &times;
              </button>
            </div>

            {/* IMAGE */}
            <img
              src={
                selectedSale.image ||
                PLACEHOLDER_IMAGE
              }
              alt={selectedSale.brand}
              className="w-full h-48 sm:h-56 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMAGE;
              }}
            />

            <div className="p-4 sm:p-5">
              {!isEditing ? (
                <>
                  {/* SALE DETAILS */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                    <span className="text-gray-500">
                      VIN Number
                    </span>

                    <span className="font-semibold text-right break-all">
                      {selectedSale.vin_number}
                    </span>

                    <span className="text-gray-500">
                      Year
                    </span>

                    <span className="font-semibold text-right">
                      {selectedSale.year}
                    </span>

                    <span className="text-gray-500">
                      Customer
                    </span>

                    <span className="font-semibold text-right break-words">
                      {selectedSale.customer_name}
                    </span>

                    <span className="text-gray-500">
                      Phone
                    </span>

                    <span className="font-semibold text-right">
                      {selectedSale.customer_phone}
                    </span>

                    <span className="text-gray-500">
                      Selling Price
                    </span>

                    <span className="font-semibold text-right">
                      {formatKsh(
                        selectedSale.selling_price
                      )}
                    </span>

                    <span className="text-gray-500">
                      Buying Price
                    </span>

                    <span className="font-semibold text-right">
                      {formatKsh(
                        selectedSale.buying_price
                      )}
                    </span>

                    <span className="text-gray-500">
                      Profit
                    </span>

                    <span
                      className={`font-semibold text-right ${Number(selectedSale.profit) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {formatKsh(
                        selectedSale.profit
                      )}
                    </span>

                    {/* PAYMENT INFO */}
                    <span className="text-gray-500">
                      Amount Paid
                    </span>

                    <span className="font-semibold text-right">
                      {formatKsh(
                        selectedSale.amount_paid
                      )}
                    </span>

                    <span className="text-gray-500">
                      Balance
                    </span>

                    <span className="font-semibold text-right text-orange-600">
                      {formatKsh(
                        selectedSale.balance
                      )}
                    </span>

                    <span className="text-gray-500">
                      Payment Status
                    </span>

                    <span className="text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${selectedSale.payment_status ===
                          "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {selectedSale.payment_status}
                      </span>
                    </span>

                    <span className="text-gray-500">
                      Sold By
                    </span>

                    <span className="font-semibold text-right">
                      {selectedSale.sold_by}
                    </span>

                    <span className="text-gray-500">
                      Date
                    </span>

                    <span className="font-semibold text-right">
                      {formatDate(selectedSale.date)}
                    </span>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={HandleStartEdit}
                      className="btn-primary w-full sm:w-auto"
                    >
                      Edit Sale
                    </button>

                    <button
                      onClick={HandleCloseModal}
                      className="btn-secondary w-full sm:w-auto"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                /* EDIT FORM */
                <form
                  onSubmit={HandleEditSubmit}
                  className="space-y-4"
                >
                  <p className="text-sm text-gray-500">
                    {selectedSale.brand} ·{" "}
                    {selectedSale.year} · sold by{" "}
                    {selectedSale.sold_by}
                  </p>

                  <div>
                    <label className="form-label">
                      VIN Number
                    </label>

                    <input
                      className="form-input w-full"
                      type="text"
                      value={vinNumber}
                      onChange={(e) =>
                        setVinNumber(e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Customer Name
                    </label>

                    <input
                      className="form-input w-full"
                      type="text"
                      value={customerName}
                      onChange={(e) =>
                        setCustomerName(e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Customer Phone
                    </label>

                    <input
                      className="form-input w-full"
                      type="text"
                      value={customerPhone}
                      onChange={(e) =>
                        setCustomerPhone(e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Selling Price
                    </label>

                    <input
                      className="form-input w-full"
                      type="number"
                      value={sellingPrice}
                      onChange={(e) =>
                        setSellingPrice(e.target.value)
                      }
                    />
                  </div>

                  {error && (
                    <div className="alert-error break-words">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full sm:w-auto disabled:opacity-60"
                    >
                      {submitting
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setIsEditing(false)
                      }
                      className="btn-secondary w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
