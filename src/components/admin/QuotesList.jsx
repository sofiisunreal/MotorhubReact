import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../context/api/api";
import QuoteView from "./QuoteView";
import QuoteStatusModal from "./QuoteStatus";

const statusStyles = {
    NEW: "bg-blue-50 text-blue-700",
    CONTACTED: "bg-amber-50 text-amber-700",
    CLOSED: "bg-emerald-50 text-emerald-700",
};

const QuotesList = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedQuote, setSelectedQuote] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);

    const FetchQuotes = async () => {
        try {
            const { data } = await api.get("quotes/");
            setQuotes(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch quotes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        FetchQuotes();
    }, []);

    const handleView = (quote) => {
        setSelectedQuote(quote);
        setViewOpen(true);
    };

    const handleStatus = (quote) => {
        setSelectedQuote(quote);
        setStatusOpen(true);
    };

    const handleUpdated = (updatedQuote) => {
        setQuotes((prev) =>
            prev.map((quote) =>
                quote.id === updatedQuote.id ? updatedQuote : quote
            )
        );

        setSelectedQuote(updatedQuote);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-5xl space-y-4">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="animate-pulse rounded-2xl bg-white p-5"
                        >
                            <div className="h-5 w-1/3 rounded bg-slate-200" />
                            <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-7">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Quote Requests
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View and manage customer enquiries.
                    </p>
                </div>

                {/* Empty */}
                {quotes.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <i className="bi bi-chat-square-text text-xl" />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No quote requests yet
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Customer enquiries will appear here.
                        </p>
                    </div>
                )}

                {/* Quotes */}
                <div className="space-y-4">
                    {quotes.map((quote) => (
                        <div
                            key={quote.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                                {/* Quote info */}
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-lg font-bold text-slate-900">
                                            {quote.customer_name}
                                        </h2>

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[quote.status]
                                                }`}
                                        >
                                            {quote.status}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm font-medium text-emerald-700">
                                        {quote.car?.brand} • {quote.car?.year}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                                        <span>
                                            <i className="bi bi-telephone mr-1" />
                                            {quote.customer_phone}
                                        </span>

                                        <span>
                                            <i className="bi bi-envelope mr-1" />
                                            {quote.customer_email}
                                        </span>
                                    </div>

                                    {quote.message && (
                                        <p className="mt-3 line-clamp-2 max-w-2xl text-sm text-slate-500">
                                            {quote.message}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 gap-2">
                                    <button
                                        onClick={() => handleView(quote)}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                                    >
                                        <i className="bi bi-eye mr-1" />
                                        View
                                    </button>

                                    <button
                                        onClick={() => handleStatus(quote)}
                                        className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                    >
                                        <i className="bi bi-arrow-repeat mr-1" />
                                        Status
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View */}
            {viewOpen && selectedQuote && (
                <QuoteView
                    quote={selectedQuote}
                    onClose={() => setViewOpen(false)}
                    onStatus={() => {
                        setViewOpen(false);
                        setStatusOpen(true);
                    }}
                />
            )}

            {/* Status */}
            {statusOpen && selectedQuote && (
                <QuoteStatusModal
                    quote={selectedQuote}
                    onClose={() => setStatusOpen(false)}
                    onUpdated={handleUpdated}
                />
            )}
        </div>
    );
};

export default QuotesList;

