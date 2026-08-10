import React from "react";

const QuoteView = ({ quote, onClose, onStatus }) => {
  const car = quote.car;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Quote Details
            </h2>

            <p className="text-xs text-slate-500">
              Request #{quote.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="space-y-7 p-5">

          {/* Car */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Vehicle
            </h3>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              {car?.image && (
                <img
                  src={car.image}
                  alt={car.brand}
                  className="h-52 w-full object-cover"
                />
              )}

              <div className="grid gap-4 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">Brand</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {car?.brand || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Year</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {car?.year || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">VIN</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {car?.vin_number || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="mt-1 font-semibold capitalize text-slate-800">
                    {car?.status || "—"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Customer */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Customer
            </h3>

            <div className="grid gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-400">Name</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {quote.customer_name}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {quote.customer_phone}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs text-slate-400">Email</p>
                <p className="mt-1 break-all font-semibold text-slate-800">
                  {quote.customer_email}
                </p>
              </div>
            </div>
          </section>

          {/* Message */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Message
            </h3>

            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {quote.message || "No message provided."}
            </div>
          </section>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-5">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {quote.status}
            </span>

            <button
              onClick={onStatus}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Update Status
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuoteView;
