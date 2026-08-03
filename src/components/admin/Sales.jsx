import React, { useState, useEffect } from 'react'
import api from '../context/api/api'

const PLACEHOLDER_IMAGE = "https://placehold.co/400x250?text=No+Image"

const formatKsh = (amount) => `Ksh ${Number(amount).toLocaleString()}`

const Sales = () => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedSale, setSelectedSale] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [sellingPrice, setSellingPrice] = useState("")
  const [vinNumber, setVinNumber] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const FetchSales = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("sales/viewsales/")
      setSales(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    FetchSales()
  }, [])

  const HandleView = (sale) => {
    setSelectedSale(sale)
    setIsEditing(false)
    setError("")
    setMessage("")
  }

  const HandleCloseModal = () => {
    setSelectedSale(null)
    setIsEditing(false)
    setError("")
    setMessage("")
  }

  const HandleStartEdit = () => {
    setCustomerName(selectedSale.customer_name || "")
    setCustomerPhone(selectedSale.customer_phone || "")
    setSellingPrice(selectedSale.selling_price ?? "")
    setVinNumber(selectedSale.vin_number || "")
    setIsEditing(true)
    setError("")
    setMessage("")
  }

  const HandleEditSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      await api.patch(`sales/update-sale/${selectedSale.sale_id}/`, {
        customer_name: customerName,
        customer_phone: customerPhone,
        selling_price: sellingPrice,
        vin_number: vinNumber,
      })
      HandleCloseModal()
      setMessage("Sale updated successfully")
      FetchSales()
    } catch (error) {
      const resData = error.response?.data
      setError(resData ? JSON.stringify(resData) : "Failed to update sale")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='p-4 md:p-4 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold mb-4'>Sales</h1>
        <p className='text-gray-600'>All recorded sales</p>
      </div>

      {message && <div className="alert-success">{message}</div>}

      {loading ? (
        <p className="text-gray-500">Loading sales...</p>
      ) : sales.length === 0 ? (
        <p className="text-gray-500">No sales recorded yet</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Customer</th>
                <th className="p-4 text-right">Profit</th>
                <th className="p-4">Staff</th>
                <th className="p-4">Sale Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sales.map((sale) => {
                const profit = Number(sale.profit)
                return (
                  <tr key={sale.sale_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5">{sale.sale_id}</td>
                    <td className="px-4 py-2.5 font-semibold">{sale.brand}</td>
                    <td className="px-4 py-2.5">
                      <p>{sale.customer_name}</p>
                      <p className="text-sm text-gray-500">{sale.customer_phone}</p>
                    </td>
                    <td className={`px-4 py-2.5 text-right font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatKsh(profit)}
                    </td>
                    <td className="px-4 py-2.5">{sale.sold_by}</td>
                    <td className="px-4 py-2.5">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => HandleView(sale)}
                        className="text-blue-600 font-semibold whitespace-nowrap"
                      >
                        <i className="bi bi-eye mr-1"></i>View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-bold">
                {isEditing ? "Edit Sale" : `${selectedSale.brand} — Sale #${selectedSale.sale_id}`}
              </h2>
              <button onClick={HandleCloseModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                &times;
              </button>
            </div>

            <img
              src={selectedSale.image || PLACEHOLDER_IMAGE}
              alt={selectedSale.brand}
              className="w-full h-56 object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = PLACEHOLDER_IMAGE
              }}
            />

            <div className="p-5">
              {!isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-gray-500">VIN Number</span>
                    <span className="font-semibold text-right">{selectedSale.vin_number}</span>
                    <span className="text-gray-500">Year</span>
                    <span className="font-semibold text-right">{selectedSale.year}</span>
                    <span className="text-gray-500">Customer</span>
                    <span className="font-semibold text-right">{selectedSale.customer_name}</span>
                    <span className="text-gray-500">Phone</span>
                    <span className="font-semibold text-right">{selectedSale.customer_phone}</span>
                    <span className="text-gray-500">Selling Price</span>
                    <span className="font-semibold text-right">{formatKsh(selectedSale.selling_price)}</span>
                    <span className="text-gray-500">Buying Price</span>
                    <span className="font-semibold text-right">{formatKsh(selectedSale.buying_price)}</span>
                    <span className="text-gray-500">Profit</span>
                    <span className={`font-semibold text-right ${Number(selectedSale.profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatKsh(selectedSale.profit)}
                    </span>

                    <span className="text-gray-500">Sold By</span>
                    <span className="font-semibold text-right">{selectedSale.sold_by}</span>

                    <span className="text-gray-500">Date</span>
                    <span className="font-semibold text-right">{new Date(selectedSale.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={HandleStartEdit} className="btn-primary">Edit Sale</button>
                    <button onClick={HandleCloseModal} className="btn-secondary">Close</button>
                  </div>
                </>
              ) : (
                <form onSubmit={HandleEditSubmit} className="space-y-4">
                  <p className="text-sm text-gray-500">
                    {selectedSale.brand} · {selectedSale.year} · sold by {selectedSale.sold_by}
                  </p>

                  <div>
                    <label className="form-label">VIN Number</label>
                    <input
                      className="form-input w-full"
                      type="text"
                      value={vinNumber}
                      onChange={(e) => setVinNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label">Customer Name</label>
                    <input
                      className="form-input w-full"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label">Customer Phone</label>
                    <input
                      className="form-input w-full"
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label">Selling Price</label>
                    <input
                      className="form-input w-full"
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                    />
                  </div>

                  {error && <div className="alert-error">{error}</div>}

                  <div className="flex gap-3">
                    <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                      {submitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
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
  )
}

export default Sales
