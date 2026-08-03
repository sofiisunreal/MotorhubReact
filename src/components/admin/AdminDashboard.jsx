import React, { useState, useEffect } from 'react'
import api from '../context/api/api'

const formatKsh = (amount) => `Ksh ${Number(amount).toLocaleString()}`

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

const StatCard = ({ icon, label, value, accent }) => (
  <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${accent}`}>
      <i className={`bi ${icon}`}></i>
    </div>
    <div>
      <p className="text-2xl font-bold leading-tight">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
)

const AdminDashboard = () => {

  console.log("Dashboard mounted")
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const FetchDashboard = async () => {
    setLoading(true)
    setError("")
    try {
      const { data } = await api.get("sales/admindashboard/")
      setStats(data)
      console.log(data)
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
    { label: "All-Time", cars: stats.sold_cars, revenue: stats.total_revenue, profit: stats.total_profit },
  ]

  const rankedStaff = [...stats.staff_performance].sort(
    (a, b) => b.revenue - a.revenue || b.cars_sold - a.cars_sold
  )
  const maxRevenue = Math.max(1, ...rankedStaff.map((s) => s.revenue))
  const rankStyles = [
    "bg-yellow-100 text-yellow-700",
    "bg-gray-100 text-gray-600",
    "bg-orange-100 text-orange-700",
  ]

  return (
    <div className="p-4 md:p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-600">Here's how the dealership is performing</p>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg p-8 text-white bg-gradient-to-br from-blue-600 via-blue-700 to-red-600">
        <i className="bi bi-car-front-fill absolute -right-6 -bottom-10 text-[180px] text-white/10 pointer-events-none"></i>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="uppercase tracking-wide text-blue-100 text-sm font-semibold mb-2">Total Revenue</p>
            <p className="text-4xl md:text-5xl font-black">{formatKsh(stats.total_revenue)}</p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-blue-100 text-sm">Total Profit</p>
              <p className="text-2xl font-bold">{formatKsh(stats.total_profit)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Cars Sold</p>
              <p className="text-2xl font-bold">{stats.sold_cars}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Overview</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard icon="bi-people-fill" label="Total Staff" value={stats.total_staff} accent="bg-blue-100 text-blue-600" />
          <StatCard icon="bi-building" label="Total Suppliers" value={stats.total_suppliers} accent="bg-blue-100 text-blue-600" />
          <StatCard icon="bi-car-front-fill" label="Total Cars" value={stats.total_cars} accent="bg-blue-100 text-blue-600" />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Inventory Status</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard icon="bi-check-circle-fill" label="Available" value={stats.available_cars} accent="bg-green-100 text-green-700" />
          <StatCard icon="bi-bookmark-fill" label="Reserved" value={stats.reserved_cars} accent="bg-yellow-100 text-yellow-700" />
          <StatCard icon="bi-tag-fill" label="Sold" value={stats.sold_cars} accent="bg-red-100 text-red-700" />
        </div>
      </div>

      {/* Performance by period */}
      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Performance</p>
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

      {/* Staff leaderboard */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-bold mb-4">Staff Performance</h2>
        {rankedStaff.length === 0 ? (
          <p className="text-gray-500 text-sm">No staff performance data yet</p>
        ) : (
          <div className="space-y-5">
            {rankedStaff.map((s, i) => {
              const pct = Math.round((s.revenue / maxRevenue) * 100)
              return (
                <div key={s.username}>
                  <div className="flex items-center justify-between mb-1 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${rankStyles[i] || "bg-blue-50 text-blue-600"
                          }`}
                      >
                        {i + 1}
                      </span>
                      <span className="font-semibold truncate">{s.username}</span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {s.cars_sold} car{s.cars_sold !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-gray-800">{formatKsh(s.revenue)}</p>
                      <p className={`text-xs ${s.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatKsh(s.profit)} profit
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent sales */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h2 className="text-lg font-bold p-5 pb-0">Recent Sales</h2>
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
                  <th className="p-4">Staff</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.recent_sales.map((sale) => (
                  <tr key={sale.sale_id} className="hover:bg-gray-50">
                    <td className="p-4 font-semibold">{sale.brand}</td>
                    <td className="p-4 text-gray-500">{sale.vin_number}</td>
                    <td className="p-4">{sale.customer_name}</td>
                    <td className="p-4">{sale.sold_by}</td>
                    <td className="p-4 text-right font-semibold">{formatKsh(sale.selling_price)}</td>
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

export default AdminDashboard
