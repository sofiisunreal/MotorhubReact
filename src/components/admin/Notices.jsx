import React, { useRef, useState, useEffect } from 'react'
import api from '../context/api/api'

const Notices = () => {
  const [notices, setNotices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const formRef = useRef(null)

  const FetchNotices = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("notices/notices/")
      setNotices(data)
    } catch (error) {
      console.error("Error fetching notices:", error)
      setError("Failed to fetch notices.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    FetchNotices()
  }, [])

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showForm])

  const HandleCancelEdit = () => {
    setEditingId(null)
    setShowForm(false)
    setTitle("")
    setDescription("")
  }

  const HandleToggleForm = () => {
    if (showForm) {
      HandleCancelEdit()
    } else {
      setShowForm(true)
    }
  }

  const HandleEdit = (notice) => {
    setEditingId(notice.id)
    setTitle(notice.title)
    setDescription(notice.description)
    setShowForm(true)
  }

  const HandleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setMessage("")

    const data = { title, description }

    try {
      let res
      if (editingId) {
        res = await api.patch(`notices/notices/${editingId}/`, data)
      } else {
        res = await api.post("notices/notices/", data)
      }
      setMessage(res.data?.message || (editingId ? "Notice updated successfully" : "Notice added successfully"))
      HandleCancelEdit()
      FetchNotices()
    } catch (error) {
      console.error("Error submitting notice:", error)
      const resData = error.response?.data
      setError(resData ? JSON.stringify(resData) : "Failed to submit notice.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='p-4 md:p-4 space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold mb-4'>Notices</h1>
          <p className='text-gray-600'>All recorded notices</p>
        </div>
        <button
          onClick={HandleToggleForm}
          className='btn-primary  text-white font-bold py-2 px-4 rounded'
        >
          <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"} mr-2`}></i>

          {showForm ? "Close Form" : "Add Notice"}
        </button>
      </div>

      {showForm && (
        <form ref={formRef} onSubmit={HandleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold">{editingId ? "Edit Notice" : "Add Notice"}</h2>
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label block mb-2 font-medium text-gray-700">
              Description
            </label>

            <textarea
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3
               text-gray-700 placeholder-gray-400
               focus:outline-none focus:ring-2 focus:ring-blue-500
               focus:border-transparent
               transition duration-200 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Enter a detailed description..."
              required
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
              {submitting ? "Saving..." : editingId ? "Update Notice" : "Add Notice"}
            </button>
            <button type="button" onClick={HandleCancelEdit} className="btn-secondary">
              Cancel
            </button>
          </div>

          {message && <div className="alert-success">{message}</div>}
          {error && <div className="alert-error">{error}</div>}
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading notices...</p>
      ) : notices.length === 0 ? (
        <p className="text-gray-500">No notices yet</p>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white p-4 rounded-xl shadow space-y-2">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-lg font-semibold">{notice.title}</h3>
                <button
                  onClick={() => HandleEdit(notice)}
                  className="text-blue-600 shrink-0"
                  aria-label={`Edit ${notice.title}`}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <p className="text-gray-600 whitespace-pre-wrap">{notice.description}</p>
              <p className="text-gray-400 text-sm">Posted on: {new Date(notice.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>

      )}
    </div>
  )
}

export default Notices
