import React, { useEffect, useState } from 'react'
import api from '../context/api/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const CarsStaff = () => {
  const [cars, setCars] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [loading, setLoading] = useState(false)
  const navigate=useNavigate()


  const FetchCars = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("cars/view_cars/")
      console.log(data)
      setCars(data)
    } catch (error) {
      toast.error("Failed to fetch cars")
    } finally {
      setLoading(false)
    }
  }
  const filteredCars = cars.filter((car) => {
    const term = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !term ||
      car.brand?.toLowerCase().includes(term) ||
      car.vin_number?.toLowerCase().includes(term) ||
      car.supplier?.toLowerCase().includes(term)

    const matchesStatus = statusFilter === "all" || car.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const StatusBadge = ({ status }) => {
    const styles = {
      available: "bg-green-100 text-green-700",
      sold: "bg-red-100 text-red-700",
      reserved: "bg-yellow-100 text-yellow-700"
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status]}`}>
        {status}
      </span>
    )
  }
  useEffect(() => {
    FetchCars()
  }, [])
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">View Cars</h1>
          <p className="text-gray-600">
            Browse all vehicles in the dealership.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search by brand, VIN or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>

        </div>
      </div>
      {/* Car Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCars.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow p-10 text-center">
            <i className="bi bi-car-front text-6xl text-gray-300"></i>
            <h3 className="text-xl font-semibold mt-4">
              No cars found
            </h3>
            <p className="text-gray-500 mt-2">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition duration-300"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.brand}
                  className="w-full h-52 object-cover"
                />

                <div className="absolute top-4 right-4">
                  <StatusBadge status={car.status} />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800">
                  {car.brand}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {car.year}
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      VIN
                    </span>
                    <span className="font-medium">
                      {car.vin_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Supplier
                    </span>

                    <span className="font-medium">
                      {car.supplier_name}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 text-center mt-4">
                    <p className="text-sm text-gray-500">
                      Price
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      KSh {Number(car.buying_price).toLocaleString()}
                    </p>
                  </div>
                </div>

                {car.status === "available" ? (
                  <button
                    onClick={() => navigate('/staff-dashboard/addsale')}
                    className="w-full mt-6 btn-primary"
                  >
                    <i className="bi bi-cart-plus mr-2"></i>
                    Create Sale
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full mt-6 bg-gray-200 text-gray-500 py-2 rounded-lg cursor-not-allowed"
                  >
                    Not Available for sale
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CarsStaff
