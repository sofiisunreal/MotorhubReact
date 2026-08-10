import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../context/api/api'
import { useNavigate, useParams } from 'react-router-dom'

const QuotesList = () => {

    const [quotes, setQuotes] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const FetchQuotes = async () => {
        setLoading(true)
        try {
            const { data } = await api.get("quotes/")
            console.log(data)
            setQuotes(data)
        } catch (error) {
            toast.error("Failed to fetch quotes")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        FetchQuotes()
    }, [])
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-4xl">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Quotes
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            View and edit quotes
                        </p>
                    </div>

                </div>

                {/* Loading state */}
                {loading && (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
                            >
                                <div className="h-5 w-1/3 rounded bg-slate-200" />
                                <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
                                <div className="mt-4 h-5 w-20 rounded-full bg-slate-100" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && quotes.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
                            <i className="bi bi-bell"></i>
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-slate-800">
                            No quotes yet
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Quotes requested by customers will appear here
                        </p>
                    </div>
                )}

                {/* Notices list */}
                {!loading && quotes.length > 0 && (
                    <div className="space-y-3">
                        {quotes.map((quote) => (
                            <div
                                key={quote.id}
                                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-md sm:flex-row sm:items-start sm:justify-between"
                            >
                                {/* Notice information */}
                                <div className="min-w-0">
                                    <h2 className="truncate text-lg font-bold text-slate-900">
                                        {quote.customer_name}
                                    </h2>

                                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                                        {quote.message}
                                    </p>

                                    <span >
                                        {quote.status}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                                    >
                                        Edit
                                    </button>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default QuotesList