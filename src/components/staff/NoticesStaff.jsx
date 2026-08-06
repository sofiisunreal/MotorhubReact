import React, { useEffect, useState } from 'react'
import api from '../context/api/api'
import { toast } from 'react-toastify'

const NoticesStaff = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(false)

  const FetchNotices = async () => {
    setLoading(true)

    try {
      const { data } = await api.get("notices/notices")
      setNotices(data)
    } catch (error) {
      toast.error("Failed to fetch notices")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    FetchNotices()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Notices
        </h1>
        <p className="text-gray-500 mt-1">
          Stay updated with dealership announcements and important information.
        </p>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading notices...
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <i className="bi bi-bell-slash text-4xl text-gray-300"></i>
          <h3 className="mt-4 font-semibold text-gray-700">
            No notices available
          </h3>
          <p className="text-gray-500 text-sm mt-2">
            New announcements will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <i className="bi bi-megaphone text-blue-600 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800">
                    {notice.title}
                  </h2>
                  <p className="mt-3 text-gray-600 leading-relaxed whitespace-pre-wrap ">
                    {notice.description}
                  </p>

                  <div className="
                    mt-5 pt-4
                    border-t
                    text-sm text-gray-400
                  ">
                    <i className="bi bi-clock mr-2"></i>
                    {new Date(notice.created_at)
                      .toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NoticesStaff
