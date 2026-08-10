import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../context/api/api";

const QuoteStatusModal = ({ quote, onClose, onUpdated }) => {
  const [status, setStatus] = useState(quote.status);
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    setLoading(true);

    try {
      const { data } = await api.patch(
        `quotes/${quote.id}/`,
        { status }
      );

      onUpdated(data);
      toast.success("Quote status updated");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Update Status
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {quote.customer_name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="p-5">

          <label className="text-sm font-semibold text-slate-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
          >
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CLOSED">Closed</option>
          </select>

          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={updateStatus}
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuoteStatusModal;

