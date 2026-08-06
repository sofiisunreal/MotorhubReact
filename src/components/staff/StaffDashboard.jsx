import React, { useState, useEffect } from 'react'
import api from '../context/api/api'

const formatKsh = (amount) => `Ksh ${Number(amount).toLocaleString()}`

const formatDate = (iso) => {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

const StaffDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const FetchDashboard = async () => {
    setLoading(true)
    setError("")
    try {
      const { data } = await api.get("sales/staffdashboard/")
      setStats(data)
    } catch (error) {
      console.log(error)
      const resData = error.response?.data
      setError(resData ? JSON.stringify(resData) : "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    FetchDashboard()
  }, [])

  if (loading) {
    return <p className="p-6 text-gray-500">Loading dashboard...</p>
  }

  if (error) {
    return <div className="alert-error m-4">{error}</div>
  }

  if (!stats) return null

  const periods = [
    { label: "Today", cars: stats.cars_sold_today, revenue: stats.today_revenue, profit: stats.today_profit },
    { label: "This Month", cars: stats.cars_sold_this_month, revenue: stats.monthly_revenue, profit: stats.monthly_profit },
    { label: "All-Time", cars: stats.total_cars_sold, revenue: stats.total_revenue, profit: stats.total_profit },
  ]

  return (
    <div className="p-4 md:p-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome back, {stats.staff.username}</h1>
          <p className="text-gray-600">Here's how you're performing</p>
        </div>
        <div className="text-sm text-gray-500 md:text-right">
          <p>{stats.staff.email}</p>
          <p>{stats.staff.phone_number}</p>
        </div>
      </div>

      {/* Hero: personal totals */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg p-8 text-white bg-gradient-to-br from-blue-600 via-blue-700 to-red-600">
        <i className="bi bi-car-front-fill absolute -right-6 -bottom-10 text-[180px] text-white/10 pointer-events-none"></i>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="uppercase tracking-wide text-blue-100 text-sm font-semibold mb-2">Your Total Revenue</p>
            <p className="text-4xl md:text-5xl font-black">{formatKsh(stats.total_revenue)}</p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-blue-100 text-sm">Total Profit</p>
              <p className="text-2xl font-bold">{formatKsh(stats.total_profit)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Cars Sold</p>
              <p className="text-2xl font-bold">{stats.total_cars_sold}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance by period */}
      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Your Performance</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {periods.map((p) => (
            <div key={p.label} className="bg-white rounded-xl shadow p-5">
              <p className="font-semibold mb-1">{p.label}</p>
              {p.cars === 0 ? (
                <p className="text-gray-400 text-sm mb-3">No sales yet</p>
              ) : (
                <p className="text-gray-500 text-sm mb-3">{p.cars} car{p.cars !== 1 ? "s" : ""} sold</p>
              )}
              <div className="flex justify-between items-center py-2 border-t">
                <span className="text-gray-500 text-sm">Revenue</span>
                <span className="font-bold text-blue-600">{formatKsh(p.revenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t">
                <span className="text-gray-500 text-sm">Profit</span>
                <span className={`font-bold ${p.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatKsh(p.profit)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent sales */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h2 className="text-lg font-bold p-5 pb-0">Your Recent Sales</h2>
        {stats.recent_sales.length === 0 ? (
          <p className="text-gray-500 text-sm p-5">No sales recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left mt-3">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="p-4">Brand</th>
                  <th className="p-4">VIN</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4 text-right">Selling Price</th>
                  <th className="p-4 text-right">Profit</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.recent_sales.map((sale) => (
                  <tr key={sale.sale_id} className="hover:bg-gray-50">
                    <td className="p-4 font-semibold">{sale.brand}</td>
                    <td className="p-4 text-gray-500">{sale.vin_number}</td>
                    <td className="p-4">{sale.customer_name}</td>
                    <td className="p-4 text-right font-semibold">{formatKsh(sale.selling_price)}</td>
                    <td className={`p-4 text-right font-semibold ${Number(sale.profit) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatKsh(sale.profit)}
                    </td>
                    <td className="p-4 text-gray-500">{formatDate(sale.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffDashboard
