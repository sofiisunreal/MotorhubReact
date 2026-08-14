import React, { useState, useEffect } from 'react'
import api from '../context/api/api'

const formatKsh = (amount) =>
  `Ksh ${Number(amount || 0).toLocaleString()}`

const formatDate = (iso) => {
  if (!iso) return "—"

  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const StatCard = ({ icon, label, value, accent }) => (
  <div className="bg-white rounded-xl shadow p-4 sm:p-5 flex items-center gap-3 sm:gap-4 min-w-0 hover:shadow-md transition-shadow">

    <div
      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shrink-0 ${accent}`}
    >
      <i className={`bi ${icon}`}></i>
    </div>

    <div className="min-w-0 flex-1">

      <p className="text-xl sm:text-2xl font-bold leading-tight break-words">
        {value}
      </p>

      <p className="text-xs sm:text-sm text-gray-500 truncate">
        {label}
      </p>

    </div>

  </div>
)

const AdminDashboard = () => {

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const FetchDashboard = async () => {

    setLoading(true)
    setError("")

    try {

      const { data } = await api.get(
        "sales/admindashboard/"
      )

      setStats(data)

    } catch (error) {

      console.log(error)

      const resData = error.response?.data

      setError(
        resData
          ? JSON.stringify(resData)
          : "Failed to load dashboard"
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    FetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 break-words">
          {error}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const periods = [

    {
      label: "Today",
      cars: stats.cars_sold_today,
      salesValue: stats.today_sales_value,
      collected: stats.today_collected,
      profit: stats.today_profit
    },

    {
      label: "This Month",
      cars: stats.cars_sold_this_month,
      salesValue: stats.monthly_sales_value,
      collected: stats.monthly_collected,
      profit: stats.monthly_profit
    },

    {
      label: "All-Time",
      cars: stats.sold_cars,
      salesValue: stats.total_sales_value,
      collected: stats.total_collected,
      profit: stats.total_profit
    }

  ]

  const rankedStaff = [
    ...(stats.staff_performance || [])
  ].sort(
    (a, b) =>
      Number(b.sales_value || 0) -
      Number(a.sales_value || 0) ||
      Number(b.cars_sold || 0) -
      Number(a.cars_sold || 0)
  )

  const maxRevenue = Math.max(
    1,
    ...rankedStaff.map(
      staff => Number(staff.sales_value || 0)
    )
  )

  const rankStyles = [
    "bg-yellow-100 text-yellow-700",
    "bg-gray-100 text-gray-600",
    "bg-orange-100 text-orange-700"
  ]

  return (

    <div className="w-full min-w-0 max-w-full px-3 py-4 sm:px-4 md:px-6 space-y-6 sm:space-y-8 overflow-x-hidden">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-1">

        <h1 className="text-xl sm:text-2xl font-bold">
          Dashboard
        </h1>

        <p className="text-sm sm:text-base text-gray-600">
          Here's how the dealership is performing
        </p>

      </div>


      {/* ================= HERO ================= */}

      <div className="relative overflow-hidden rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 text-white bg-gradient-to-br from-blue-600 via-blue-700 to-red-600">

        <i className="bi bi-car-front-fill absolute -right-10 -bottom-10 text-[100px] sm:text-[140px] md:text-[180px] text-white/10 pointer-events-none"></i>

        <div className="relative z-10 min-w-0">

          <p className="uppercase tracking-wide text-blue-100 text-xs sm:text-sm font-semibold mb-2">
            Total Sales Value
          </p>

          <p className="text-2xl sm:text-4xl md:text-5xl font-black break-words leading-tight">
            {formatKsh(stats.total_sales_value)}
          </p>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-8 mt-6">

            <div className="min-w-0">

              <p className="text-blue-100 text-xs sm:text-sm">
                Money Collected
              </p>

              <p className="text-lg sm:text-2xl font-bold break-words">
                {formatKsh(stats.total_collected)}
              </p>

            </div>

            <div className="min-w-0">

              <p className="text-blue-100 text-xs sm:text-sm">
                Outstanding
              </p>

              <p className="text-lg sm:text-2xl font-bold break-words">
                {formatKsh(stats.total_outstanding)}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ================= OVERVIEW ================= */}

      <section>

        <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Overview
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <StatCard
            icon="bi-people-fill"
            label="Total Staff"
            value={stats.total_staff}
            accent="bg-blue-100 text-blue-600"
          />

          <StatCard
            icon="bi-building"
            label="Total Suppliers"
            value={stats.total_suppliers}
            accent="bg-blue-100 text-blue-600"
          />

          <StatCard
            icon="bi-car-front-fill"
            label="Total Cars"
            value={stats.total_cars}
            accent="bg-blue-100 text-blue-600"
          />

        </div>

      </section>


      {/* ================= INVENTORY ================= */}

      <section>

        <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Inventory Status
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <StatCard
            icon="bi-check-circle-fill"
            label="Available"
            value={stats.available_cars}
            accent="bg-green-100 text-green-700"
          />

          <StatCard
            icon="bi-bookmark-fill"
            label="Reserved"
            value={stats.reserved_cars}
            accent="bg-yellow-100 text-yellow-700"
          />

          <StatCard
            icon="bi-tag-fill"
            label="Sold"
            value={stats.sold_cars}
            accent="bg-red-100 text-red-700"
          />

        </div>

      </section>


      {/* ================= PAYMENT OVERVIEW ================= */}

      <section>

        <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Payment Overview
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <StatCard
            icon="bi-cash-stack"
            label="Money Collected"
            value={formatKsh(stats.total_collected)}
            accent="bg-green-100 text-green-700"
          />

          <StatCard
            icon="bi-hourglass-split"
            label="Outstanding"
            value={formatKsh(stats.total_outstanding)}
            accent="bg-orange-100 text-orange-700"
          />

          <StatCard
            icon="bi-check-circle-fill"
            label="Fully Paid Sales"
            value={stats.paid_sales}
            accent="bg-blue-100 text-blue-700"
          />

        </div>

      </section>


      {/* ================= PAYMENT STATUS ================= */}

      <section>

        <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Payment Status
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-white rounded-xl shadow p-4 sm:p-5">

            <div className="flex items-center justify-between gap-4">

              <div className="min-w-0">

                <p className="text-xs sm:text-sm text-gray-500">
                  Fully Paid Sales
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                  {stats.paid_sales}
                </p>

              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg sm:text-xl shrink-0">

                <i className="bi bi-check-circle-fill"></i>

              </div>

            </div>

          </div>


          <div className="bg-white rounded-xl shadow p-4 sm:p-5">

            <div className="flex items-center justify-between gap-4">

              <div className="min-w-0">

                <p className="text-xs sm:text-sm text-gray-500">
                  Partial Payments
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">
                  {stats.partial_sales}
                </p>

              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg sm:text-xl shrink-0">

                <i className="bi bi-hourglass-split"></i>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= PERFORMANCE ================= */}

      <section>

        <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Performance
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {periods.map((period) => (

            <div
              key={period.label}
              className="bg-white rounded-xl shadow p-4 sm:p-5 min-w-0"
            >

              <div className="flex items-center justify-between gap-3 mb-3">

                <p className="font-semibold">
                  {period.label}
                </p>

                <span className="text-xs sm:text-sm text-gray-500 shrink-0">
                  {period.cars} car
                  {period.cars !== 1 ? "s" : ""}
                </span>

              </div>

              {period.cars === 0 && (
                <p className="text-gray-400 text-sm mb-3">
                  No sales yet
                </p>
              )}

              <div className="flex justify-between items-center gap-3 py-2 border-t">

                <span className="text-gray-500 text-xs sm:text-sm">
                  Sales Value
                </span>

                <span className="font-bold text-blue-600 text-sm sm:text-base text-right break-words">
                  {formatKsh(period.salesValue)}
                </span>

              </div>


              <div className="flex justify-between items-center gap-3 py-2 border-t">

                <span className="text-gray-500 text-xs sm:text-sm">
                  Collected
                </span>

                <span className="font-bold text-green-600 text-sm sm:text-base text-right break-words">
                  {formatKsh(period.collected)}
                </span>

              </div>


              <div className="flex justify-between items-center gap-3 py-2 border-t">

                <span className="text-gray-500 text-xs sm:text-sm">
                  Profit
                </span>

                <span
                  className={`font-bold text-sm sm:text-base text-right break-words ${
                    Number(period.profit) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatKsh(period.profit)}
                </span>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ================= STAFF PERFORMANCE ================= */}

      <section className="bg-white rounded-xl shadow p-4 sm:p-5 min-w-0">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">

          <h2 className="text-lg font-bold">
            Staff Performance
          </h2>

          <span className="text-xs sm:text-sm text-gray-500">
            {rankedStaff.length} staff
          </span>

        </div>


        {rankedStaff.length === 0 ? (

          <p className="text-gray-500 text-sm">
            No staff performance data yet
          </p>

        ) : (

          <div className="space-y-5">

            {rankedStaff.map((staff, index) => {

              const revenue = Number(
                staff.sales_value || 0
              )

              const pct = Math.round(
                (revenue / maxRevenue) * 100
              )

              return (

                <div
                  key={staff.username}
                  className="min-w-0"
                >

                  {/* Staff information */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">

                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">

                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          rankStyles[index] ||
                          "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {index + 1}
                      </span>

                      <div className="min-w-0">

                        <p className="font-semibold truncate">
                          {staff.username}
                        </p>

                        <p className="text-xs text-gray-400">
                          {staff.cars_sold} car
                          {staff.cars_sold !== 1 ? "s" : ""}
                        </p>

                      </div>

                    </div>


                    <div className="text-left sm:text-right min-w-0">

                      <p className="font-semibold text-gray-800 break-words">
                        {formatKsh(staff.sales_value)}
                      </p>

                      <p
                        className={`text-xs ${
                          Number(staff.profit) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatKsh(staff.profit)} profit
                      </p>

                    </div>

                  </div>


                  {/* Progress */}

                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`
                      }}
                    />

                  </div>

                </div>

              )

            })}

          </div>

        )}

      </section>


      {/* ================= RECENT SALES ================= */}

      <section className="bg-white rounded-xl shadow overflow-hidden min-w-0">

        <div className="p-4 sm:p-5">

          <h2 className="text-lg font-bold">
            Recent Sales
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Latest vehicle sales
          </p>

        </div>


        {stats.recent_sales.length === 0 ? (

          <p className="text-gray-500 text-sm p-5">
            No sales recorded yet
          </p>

        ) : (

          /*
           * On mobile the table scrolls horizontally instead of
           * breaking the entire page.
           */

          <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[900px] text-left">

              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">

                <tr>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Brand
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    VIN
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Customer
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Staff
                  </th>

                  <th className="px-4 py-3 text-right whitespace-nowrap">
                    Sale Value
                  </th>

                  <th className="px-4 py-3 text-right whitespace-nowrap">
                    Paid
                  </th>

                  <th className="px-4 py-3 text-right whitespace-nowrap">
                    Balance
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Status
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Date
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y">

                {stats.recent_sales.map((sale) => (

                  <tr
                    key={sale.sale_id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-4 py-3 font-semibold whitespace-nowrap">
                      {sale.brand}
                    </td>

                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {sale.vin_number}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {sale.customer_name}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {sale.sold_by || "—"}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                      {formatKsh(sale.selling_price)}
                    </td>

                    <td className="px-4 py-3 text-right text-green-600 font-semibold whitespace-nowrap">
                      {formatKsh(sale.amount_paid)}
                    </td>

                    <td className="px-4 py-3 text-right text-orange-600 font-semibold whitespace-nowrap">
                      {formatKsh(sale.balance)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          sale.payment_status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {sale.payment_status}
                      </span>

                    </td>

                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDate(sale.date)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  )
}

export default AdminDashboard