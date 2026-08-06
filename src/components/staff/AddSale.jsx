import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../context/api/api'
import { useNavigate, useParams } from 'react-router-dom'

const AddSale = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [car, setCar] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    selling_price: ""
  })
  const FetchCars = async () => {
    try {
      const { data } = await api.get(`cars/view_car/${id}/`)
      console.log(data)
      setCar(data)
    } catch (error) {
      toast.error("Failed to fetch car")
    } finally {
      setFetching(false)
    }
  }
  useEffect(() => {
    FetchCars()
  }, [])
  const HandleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const HandleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post("sales/addsale/", {
        car_id: car.vin_number,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        selling_price: form.selling_price
      })

      toast.success("Car sold successfully")
      navigate("/staff-dashboard/cars")

    } catch (err) {
      console.log(err.response?.data)
      toast.error(
        err.response?.data?.error || "Failed to sell car"
      )
    } finally {
      setLoading(false)
    }
  }
  if (fetching) return <p className="p-6 text-gray-500">Loading Car...</p>

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/staff-dashboard/cars")}
            className="text-blue-600 hover:text-blue-800 text-sm mb-3"
          >
            ← Back to Cars
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Create Sale
          </h1>
          <p className="text-gray-500">
            Complete customer and payment details to sell this vehicle.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CAR DETAILS */}
          <div className="bg-white rounded-2xl shadow-md p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Vehicle Details
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Car ID</p>
                <p className="font-semibold">
                  {car?.car_id}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Brand</p>
                <p className="font-semibold">
                  {car?.brand}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Model</p>
                <p className="font-semibold">
                  {car?.model}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Buying Price</p>
                <p className="font-semibold text-blue-600">
                  Ksh {Number(car?.buying_price).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">
                  Status
                </p>
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  {car?.status}
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Customer Information
            </h2>
            <form onSubmit={HandleSubmit}>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Customer Name
                  </label>
                  <input
                    name="customer_name"
                    value={form.customer_name}
                    onChange={HandleChange}
                    placeholder="John Doe"
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    name="customer_phone"
                    value={form.customer_phone}
                    onChange={HandleChange}
                    placeholder="07XX XXX XXX"
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">

                  <label className="block text-sm font-medium mb-2">
                    Selling Price
                  </label>

                  <input
                    name="selling_price"
                    value={form.selling_price}
                    onChange={HandleChange}
                    type="number"
                    placeholder="Enter selling price"
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
              >
                {loading ? "Processing Sale..." : "Complete Sale"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddSale
