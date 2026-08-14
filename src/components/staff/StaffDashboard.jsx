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
    <div className="bg-white rounded-xl shadow p-4 sm:p-5 min-w-0">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-base sm:text-lg">
          {title}
        </h3>

        <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
          {cars} car{cars !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3">

        {/* Sales Value */}
        <div className="flex justify-between items-center gap-3">
          <span className="text-gray-500 text-sm">
            Sales Value
          </span>

          <span className="font-bold text-blue-600 text-sm sm:text-base text-right">
            {formatKsh(salesValue)}
          </span>
        </div>

        {/* Collected */}
        <div className="flex justify-between items-center gap-3">
          <span className="text-gray-500 text-sm">
            Collected
          </span>

          <span className="font-bold text-green-600 text-sm sm:text-base text-right">
            {formatKsh(collected)}
          </span>
        </div>

        {/* Outstanding */}
        <div className="flex justify-between items-center gap-3 border-t pt-3">
          <span className="text-gray-500 text-sm">
            Outstanding
          </span>

          <span
            className={`font-bold text-sm sm:text-base text-right ${
              Number(outstanding) > 0
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            {formatKsh(outstanding)}
          </span>
        </div>

        {/* Profit */}
        <div className="flex justify-between items-center gap-3 border-t pt-3">
          <span className="text-gray-500 text-sm">
            Profit
          </span>

          <span
            className={`font-bold text-sm sm:text-base text-right ${
              Number(profit) >= 0
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


const MobileSaleCard = ({ sale }) => {
  return (
    <div className="border rounded-xl p-4 space-y-4">

      {/* Top */}
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">
          <p className="font-bold text-gray-800 truncate">
            {sale.brand}
          </p>

          <p className="text-sm text-gray-500 break-words">
            {sale.customer_name}
          </p>
        </div>

        <span
          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
            sale.payment_status === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {sale.payment_status === "paid"
            ? "Paid"
            : "Partial"}
        </span>

      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-3">

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">
            Selling Price
          </p>

          <p className="font-bold text-gray-800 text-sm">
            {formatKsh(sale.selling_price)}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">
            Paid
          </p>

          <p className="font-bold text-green-600 text-sm">
            {formatKsh(sale.amount_paid)}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">
            Balance
          </p>

          <p className="font-bold text-orange-600 text-sm">
            {formatKsh(sale.balance)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">
            Date
          </p>

          <p className="font-semibold text-gray-700 text-sm">
            {formatDate(sale.date)}
          </p>
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
      <div className="w-full min-w-0 px-4 py-5 sm:p-6">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="w-full min-w-0 px-4 py-5 sm:p-6">
        <div className="alert-error break-words">
          {error}
        </div>
      </div>
    );
  }


  if (!stats) {
    return null;
  }


  return (

    <div className="w-full min-w-0 px-3 py-4 sm:px-4 md:px-6 lg:px-6 space-y-6 sm:space-y-8 overflow-x-hidden">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">

        <div className="min-w-0">

          <h1 className="text-xl sm:text-2xl font-bold mb-1 break-words">
            Welcome back, {stats.staff.username}
          </h1>

          <p className="text-sm sm:text-base text-gray-600">
            Here's how you're performing
          </p>

        </div>


        <div className="text-sm text-gray-500 md:text-right min-w-0">

          <p className="break-all">
            {stats.staff.email}
          </p>

          <p className="break-words">
            {stats.staff.phone_number}
          </p>

        </div>

      </div>


      {/* =========================
          HERO
      ========================= */}

      <div className="relative overflow-hidden rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 text-white bg-gradient-to-br from-blue-600 via-blue-700 to-red-600">

        <i className="bi bi-car-front-fill absolute -right-10 -bottom-8 text-[110px] sm:text-[150px] md:text-[180px] text-white/10 pointer-events-none"></i>


        <div className="relative z-10 min-w-0">

          <p className="uppercase tracking-wide text-blue-100 text-xs sm:text-sm font-semibold mb-2">
            Your Total Sales
          </p>


          <p className="text-3xl sm:text-4xl md:text-5xl font-black break-words">
            {formatKsh(stats.all_time.sales_value)}
          </p>


          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 md:gap-8 mt-6">

            <div className="min-w-0">

              <p className="text-blue-100 text-xs sm:text-sm">
                Collected
              </p>

              <p className="text-lg sm:text-xl md:text-2xl font-bold break-words">
                {formatKsh(stats.all_time.collected)}
              </p>

            </div>


            <div className="min-w-0">

              <p className="text-blue-100 text-xs sm:text-sm">
                Outstanding
              </p>

              <p className="text-lg sm:text-xl md:text-2xl font-bold break-words">
                {formatKsh(stats.all_time.outstanding)}
              </p>

            </div>


            <div className="min-w-0">

              <p className="text-blue-100 text-xs sm:text-sm">
                Profit
              </p>

              <p className="text-lg sm:text-xl md:text-2xl font-bold break-words">
                {formatKsh(stats.all_time.profit)}
              </p>

            </div>


            <div className="min-w-0">

              <p className="text-blue-100 text-xs sm:text-sm">
                Cars Sold
              </p>

              <p className="text-lg sm:text-xl md:text-2xl font-bold">
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

        <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Your Performance
        </p>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">

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

        <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Payment Status
        </p>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

          {/* Paid */}

          <div className="bg-white rounded-xl shadow p-4 sm:p-5 flex items-center gap-4 min-w-0">

            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl shrink-0">

              <i className="bi bi-check-circle-fill"></i>

            </div>


            <div className="min-w-0">

              <p className="text-xl sm:text-2xl font-bold">
                {stats.payment_status.paid_sales}
              </p>

              <p className="text-sm text-gray-500">
                Fully Paid Sales
              </p>

            </div>

          </div>


          {/* Partial */}

          <div className="bg-white rounded-xl shadow p-4 sm:p-5 flex items-center gap-4 min-w-0">

            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl shrink-0">

              <i className="bi bi-hourglass-split"></i>

            </div>


            <div className="min-w-0">

              <p className="text-xl sm:text-2xl font-bold">
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

        <div className="p-4 sm:p-5 pb-3">

          <h2 className="text-lg font-bold">
            Your Recent Sales
          </h2>

        </div>


        {stats.recent_sales.length === 0 ? (

          <p className="text-gray-500 text-sm p-5">
            No sales recorded yet
          </p>

        ) : (

          <>
            {/* =========================
                MOBILE SALES
            ========================= */}

            <div className="block md:hidden px-4 pb-4 space-y-3">

              {stats.recent_sales.map((sale) => (

                <MobileSaleCard
                  key={sale.sale_id}
                  sale={sale}
                />

              ))}

            </div>


            {/* =========================
                DESKTOP TABLE
            ========================= */}

            <div className="hidden md:block overflow-x-auto">

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


                      <td className="p-4 text-right font-semibold whitespace-nowrap">
                        {formatKsh(sale.selling_price)}
                      </td>


                      <td className="p-4 text-right text-green-600 font-semibold whitespace-nowrap">
                        {formatKsh(sale.amount_paid)}
                      </td>


                      <td className="p-4 text-right text-orange-600 font-semibold whitespace-nowrap">
                        {formatKsh(sale.balance)}
                      </td>


                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            sale.payment_status === "paid"
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

          </>

        )}

      </div>

    </div>

  );
};

export default StaffDashboard;