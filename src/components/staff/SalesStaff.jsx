import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../context/api/api'

const SalesStaff = () => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState(false)

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    payment_method: "cash",
    payment_reference: "",
    notes: ""
  })

  // =========================
  // FETCH SALES
  // =========================

  const FetchSales = async () => {
    setLoading(true)

    try {
      const { data } = await api.get("sales/viewsales/")
      setSales(data)
    } catch (error) {
      console.log(error.response?.data)
      toast.error("Failed to fetch sales")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    FetchSales()
  }, [])


  const OpenPaymentModal = (sale) => {
    setSelectedSale(sale)

    setPaymentForm({
      amount: "",
      payment_method: "cash",
      payment_reference: "",
      notes: ""
    })

    setShowPaymentModal(true)
  }

  const ClosePaymentModal = () => {
    if (paymentLoading) return

    setShowPaymentModal(false)
    setSelectedSale(null)
  }
  const HandlePaymentChange = (e) => {
    const { name, value } = e.target

    setPaymentForm({
      ...paymentForm,
      [name]: value
    })
  }


  const HandleAddPayment = async (e) => {
    e.preventDefault()

    if (!selectedSale) return

    const amount = Number(paymentForm.amount)
    const balance = Number(selectedSale.balance)

    if (!amount || amount <= 0) {
      toast.error("Payment amount must be greater than zero")
      return
    }

    if (amount > balance) {
      toast.error(
        `Payment cannot exceed the remaining balance of KSh ${balance.toLocaleString()}`
      )
      return
    }

    setPaymentLoading(true)

    try {
      const { data } = await api.post(
        `sales/addpayment/${selectedSale.sale_id}/`,
        {
          amount: paymentForm.amount,
          payment_method: paymentForm.payment_method,
          payment_reference: paymentForm.payment_reference,
          notes: paymentForm.notes
        }
      )

      console.log(data)

      toast.success("Payment recorded successfully")

      setShowPaymentModal(false)
      setSelectedSale(null)

      // Refresh sales so balance/status updates
      FetchSales()

    } catch (error) {
      console.log(error.response?.data)

      toast.error(
        error.response?.data?.error ||
        "Failed to record payment"
      )
    } finally {
      setPaymentLoading(false)
    }
  }

  if (loading) {
    return (
      <p className="p-6 text-gray-500">
        Loading sales...
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Sales History
        </h1>

        <p className="text-gray-500 mt-1">
          View vehicle sales and manage customer payments.
        </p>

      </div>


      {/* SALES */}
      {sales.length === 0 ? (

        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

          <i className="bi bi-receipt text-5xl text-gray-300"></i>

          <h3 className="mt-4 font-semibold text-gray-700">
            No sales yet
          </h3>

          <p className="text-gray-500">
            Completed sales will appear here.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {sales.map((sale) => (

            <div
              key={sale.sale_id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition p-6"
            >

              {/* SALE HEADER */}

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-lg font-bold text-gray-800">
                    Sale #{sale.sale_id}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {new Date(sale.date).toLocaleDateString()}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${sale.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                    }`}
                >
                  {sale.payment_status === "paid"
                    ? "Paid"
                    : "Partial"}
                </span>

              </div>


              {/* VEHICLE */}

              <div className="mt-5 bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  Vehicle
                </p>

                <h3 className="font-bold text-gray-800">
                  {sale.brand}
                </h3>

                <p className="text-sm text-gray-500">
                  VIN: {sale.vin_number}
                </p>

              </div>


              {/* CUSTOMER */}

              <div className="mt-5 space-y-3">

                <div className="flex justify-between gap-4">

                  <span className="text-gray-500">
                    Customer
                  </span>

                  <span className="font-medium text-right">
                    {sale.customer_name}
                  </span>

                </div>

                <div className="flex justify-between gap-4">

                  <span className="text-gray-500">
                    Phone
                  </span>

                  <span className="font-medium text-right">
                    {sale.customer_phone}
                  </span>

                </div>

              </div>


              {/* SELLING PRICE */}

              <div className="mt-5 bg-blue-50 rounded-xl p-4">

                <p className="text-sm text-gray-500">
                  Selling Price
                </p>

                <p className="text-2xl font-bold text-blue-700">
                  KSh {Number(sale.selling_price).toLocaleString()}
                </p>

              </div>


              {/* PAYMENT SUMMARY */}

              <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-3">

                <div className="flex justify-between">

                  <span className="text-sm text-gray-500">
                    Amount Paid
                  </span>

                  <span className="font-semibold text-green-600">
                    KSh {Number(sale.amount_paid).toLocaleString()}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-sm text-gray-500">
                    Balance
                  </span>

                  <span className="font-semibold text-orange-600">
                    KSh {Number(sale.balance).toLocaleString()}
                  </span>

                </div>

              </div>


              {/* PAYMENT HISTORY */}

              {sale.payments?.length > 0 && (

                <div className="mt-5">

                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Payment History
                  </p>

                  <div className="space-y-2">

                    {sale.payments.map((payment) => (

                      <div
                        key={payment.id}
                        className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
                      >

                        <div>

                          <p className="text-sm font-medium">
                            KSh {Number(payment.amount).toLocaleString()}
                          </p>

                          <p className="text-xs text-gray-500 capitalize">
                            {payment.method}
                          </p>

                        </div>

                        {payment.reference && (
                          <span className="text-xs text-gray-400">
                            {payment.reference}
                          </span>
                        )}

                      </div>

                    ))}

                  </div>

                </div>

              )}


              {/* SOLD BY */}

              <p className="mt-4 text-sm text-gray-500">
                Sold by: {sale.sold_by}
              </p>


              {/* ADD PAYMENT */}

              {sale.payment_status === "partial" && (
                <button
                  onClick={() => OpenPaymentModal(sale)}
                  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  <i className="bi bi-credit-card mr-2"></i>
                  Add Payment
                </button>
              )}

            </div>

          ))}

        </div>

      )}
      {showPaymentModal && selectedSale && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

            {/* MODAL HEADER */}

            <div className="flex justify-between items-start mb-6">

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  Add Payment
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Sale #{selectedSale.sale_id}
                </p>

              </div>

              <button
                type="button"
                onClick={ClosePaymentModal}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <i className="bi bi-x-lg"></i>
              </button>

            </div>


            {/* BALANCE */}

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">

              <div className="flex justify-between">

                <span className="text-sm text-gray-600">
                  Remaining Balance
                </span>

                <span className="font-bold text-orange-600">
                  KSh {Number(selectedSale.balance).toLocaleString()}
                </span>

              </div>

            </div>


            {/* FORM */}

            <form onSubmit={HandleAddPayment}>

              {/* AMOUNT */}

              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={paymentForm.amount}
                  onChange={HandlePaymentChange}
                  min="1"
                  max={selectedSale.balance}
                  placeholder="Enter amount"
                  className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />

              </div>


              {/* METHOD */}

              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>

                <select
                  name="payment_method"
                  value={paymentForm.payment_method}
                  onChange={HandlePaymentChange}
                  className="w-full rounded-xl border px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >

                  <option value="cash">
                    Cash
                  </option>

                  <option value="bank">
                    Bank
                  </option>

                </select>

              </div>


              {/* REFERENCE */}

              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Reference
                </label>

                <input
                  type="text"
                  name="payment_reference"
                  value={paymentForm.payment_reference}
                  onChange={HandlePaymentChange}
                  placeholder="e.g. Bank transaction reference"
                  className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />

              </div>


              {/* NOTES */}

              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={paymentForm.notes}
                  onChange={HandlePaymentChange}
                  rows="3"
                  placeholder="Optional payment notes"
                  className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={ClosePaymentModal}
                  disabled={paymentLoading}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold transition"
                >
                  {paymentLoading
                    ? "Recording..."
                    : "Record Payment"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default SalesStaff

