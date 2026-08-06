import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../context/api/api'

const SalesStaff = () => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)

  const FetchSales = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("sales/viewsales/")
      setSales(data)
    } catch (error) {
      toast.error("Failed to fetch sales")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    FetchSales()
  }, [])

  if (loading) {
    return (
      <p className="p-6 text-gray-500">
        Loading sales...
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Sales History
        </h1>
        <p className="text-gray-500 mt-1">
          View completed vehicle sales.
        </p>

      </div>

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
              key={sale.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition p-6">
              <div className=" flex justify-between items-start ">

                <div>
                  <h2 className=" text-lg font-bold text-gray-800 ">
                    Sale #{sale.sale_id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(sale.date)
                      .toLocaleDateString()}
                  </p>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold ">
                  Completed
                </span>
              </div>

              <div className="mt-5 bg-gray-50 rounded-xl p-4 ">

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
              <div className="mt-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Customer
                  </span>
                  <span className="font-medium">
                    {sale.customer_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Phone
                  </span>
                  <span className="font-medium">
                    {sale.customer_phone}
                  </span>
                </div>
              </div>

              <div className="mt-5 bg-blue-50 rounded-xl p-4 text-center ">
                <p className="text-sm text-gray-500">
                  Selling Price
                </p>
                <p className=" text-2xl font-bold text-blue-700">
                  KSh {Number(sale.selling_price)
                    .toLocaleString()}
                </p>
              </div>
              <p className=" mt-4 text-sm text-gray-500">
                Sold by: {sale.sold_by}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default SalesStaff
