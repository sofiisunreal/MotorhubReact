import React, { useEffect, useState } from "react";
import api from "../context/api/api";
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

const PerformanceCard = ({
  title,
  cars,
  salesValue,
  collected,
  outstanding,
  profit,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{title}</h3>

        <span className="text-sm text-gray-500">
          {cars} car{cars !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3">

        {/* Sales Value */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            Sales Value
          </span>

          <span className="font-bold text-blue-600">
            {formatKsh(salesValue)}
          </span>
        </div>

        {/* Collected */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            Collected
          </span>

          <span className="font-bold text-green-600">
            {formatKsh(collected)}
          </span>
        </div>

        {/* Outstanding */}
        <div className="flex justify-between items-center border-t pt-3">
          <span className="text-gray-500 text-sm">
            Outstanding
          </span>

          <span
            className={`font-bold ${Number(outstanding) > 0
              ? "text-orange-600"
              : "text-green-600"
              }`}
          >
            {formatKsh(outstanding)}
          </span>
        </div>

        {/* Profit */}
        <div className="flex justify-between items-center border-t pt-3">
          <span className="text-gray-500 text-sm">
            Profit
          </span>

          <span
            className={`font-bold ${Number(profit) >= 0
              ? "text-green-600"
              : "text-red-600"
              }`}
          >
            {formatKsh(profit)}
          </span>
        </div>

      </div>
    </div>
  );
};

const StaffDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const FetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get(
        "sales/staffdashboard/"
      );

      console.log("Staff dashboard:", data);

      setStats(data);
    } catch (error) {
      console.log(error);

      const resData = error.response?.data;

      setError(
        resData
          ? JSON.stringify(resData)
          : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchDashboard();
  }, []);

  if (loading) {
    return (
      <p className="p-6 text-gray-500">
        Loading dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <div className="alert-error m-4">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="p-4 md:p-6 space-y-8">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {stats.staff.username}
          </h1>

          <p className="text-gray-600">
            Here's how you're performing
          </p>
        </div>

        <div className="text-sm text-gray-500 md:text-right">
          <p>{stats.staff.email}</p>
          <p>{stats.staff.phone_number}</p>
        </div>

      </div>

      {/* =========================
          HERO
      ========================= */}

      <div className="relative overflow-hidden rounded-2xl shadow-lg p-6 md:p-8 text-white bg-gradient-to-br from-blue-600 via-blue-700 to-red-600">

        <i className="bi bi-car-front-fill absolute -right-6 -bottom-10 text-[150px] md:text-[180px] text-white/10 pointer-events-none"></i>

        <div className="relative z-10">

          <p className="uppercase tracking-wide text-blue-100 text-sm font-semibold mb-2">
            Your Total Sales
          </p>

          <p className="text-3xl md:text-5xl font-black">
            {formatKsh(stats.all_time.sales_value)}
          </p>

          <div className="grid grid-cols-2 md:flex md:gap-10 mt-6 gap-5">

            <div>
              <p className="text-blue-100 text-sm">
                Collected
              </p>

              <p className="text-xl md:text-2xl font-bold">
                {formatKsh(stats.all_time.collected)}
              </p>
            </div>

            <div>
              <p className="text-blue-100 text-sm">
                Outstanding
              </p>

              <p className="text-xl md:text-2xl font-bold">
                {formatKsh(stats.all_time.outstanding)}
              </p>
            </div>

            <div>
              <p className="text-blue-100 text-sm">
                Profit
              </p>

              <p className="text-xl md:text-2xl font-bold">
                {formatKsh(stats.all_time.profit)}
              </p>
            </div>

            <div>
              <p className="text-blue-100 text-sm">
                Cars Sold
              </p>

              <p className="text-xl md:text-2xl font-bold">
                {stats.all_time.cars_sold}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* =========================
          PERFORMANCE
      ========================= */}

      <div>

        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Your Performance
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <PerformanceCard
            title="Today"
            cars={stats.today.cars_sold}
            salesValue={stats.today.sales_value}
            collected={stats.today.collected}
            outstanding={stats.today.outstanding}
            profit={stats.today.profit}
          />

          <PerformanceCard
            title="This Month"
            cars={stats.monthly.cars_sold}
            salesValue={stats.monthly.sales_value}
            collected={stats.monthly.collected}
            outstanding={stats.monthly.outstanding}
            profit={stats.monthly.profit}
          />

          <PerformanceCard
            title="All-Time"
            cars={stats.all_time.cars_sold}
            salesValue={stats.all_time.sales_value}
            collected={stats.all_time.collected}
            outstanding={stats.all_time.outstanding}
            profit={stats.all_time.profit}
          />

        </div>

      </div>

      {/* =========================
          PAYMENT STATUS
      ========================= */}

      <div>

        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Payment Status
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
              <i className="bi bi-check-circle-fill"></i>
            </div>

            <div>
              <p className="text-2xl font-bold">
                {stats.payment_status.paid_sales}
              </p>

              <p className="text-sm text-gray-500">
                Fully Paid Sales
              </p>
            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
              <i className="bi bi-hourglass-split"></i>
            </div>

            <div>
              <p className="text-2xl font-bold">
                {stats.payment_status.partial_sales}
              </p>

              <p className="text-sm text-gray-500">
                Partially Paid Sales
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* =========================
          RECENT SALES
      ========================= */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-5 pb-3">
          <h2 className="text-lg font-bold">
            Your Recent Sales
          </h2>
        </div>

        {stats.recent_sales.length === 0 ? (

          <p className="text-gray-500 text-sm p-5">
            No sales recorded yet
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">

                <tr>
                  <th className="p-4">
                    Brand
                  </th>

                  <th className="p-4">
                    Customer
                  </th>

                  <th className="p-4 text-right">
                    Selling Price
                  </th>

                  <th className="p-4 text-right">
                    Paid
                  </th>

                  <th className="p-4 text-right">
                    Balance
                  </th>

                  <th className="p-4">
                    Status
                  </th>

                  <th className="p-4">
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

                    <td className="p-4 font-semibold">
                      {sale.brand}
                    </td>

                    <td className="p-4">
                      {sale.customer_name}
                    </td>

                    <td className="p-4 text-right font-semibold">
                      {formatKsh(sale.selling_price)}
                    </td>

                    <td className="p-4 text-right text-green-600 font-semibold">
                      {formatKsh(sale.amount_paid)}
                    </td>

                    <td className="p-4 text-right text-orange-600 font-semibold">
                      {formatKsh(sale.balance)}
                    </td>

                    <td className="p-4">

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

                    </td>

                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {formatDate(sale.date)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default StaffDashboard;
