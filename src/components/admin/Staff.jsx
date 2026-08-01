import React, { useRef, useState, useEffect } from 'react'
import api from '../context/api/api'

const Staff = () => {
  const [staff, setStaff] = useState([])
  const [username, setUserName] = useState("")
  const [firstname, setFirstName] = useState("")
  const [lastname, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phonenumber, setPhoneNumber] = useState("")
  const [role, setRole] = useState("staff")
  const [password, setPassword] = useState("1234")

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const formRef = useRef(null)

  const FetchStaff = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("core/staff/")
      setStaff(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    FetchStaff()
  }, [])

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showForm])

  const HandleCancelEdit = () => {
    setEditingId(null)
    setShowForm(false)
    setUserName("")
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhoneNumber("")
    setRole("staff")
    setPassword("1234")
  }

  const HandleToggleForm = () => {
    if (showForm) {
      HandleCancelEdit()
    } else {
      setShowForm(true)
    }
  }

  const HandleEdit = (member) => {
    setEditingId(member.id)
    setUserName(member.username)
    setFirstName(member.first_name)
    setLastName(member.last_name)
    setEmail(member.email)
    setPhoneNumber(member.phone_number)
    setRole(member.role)
    setShowForm(true)
  }

  const HandleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setMessage("")

    const data = {
      username,
      first_name: firstname,
      last_name: lastname,
      email,
      phone_number: phonenumber,
      role,
    }

    // Only send a password when creating a new account —
    // never overwrite an existing one during an edit.
    if (!editingId) {
      data.password = password
    }

    try {
      let res
      if (editingId) {
        res = await api.patch(`core/staff/${editingId}/`, data)
      } else {
        res = await api.post("core/register/", data)
      }
      setMessage(res.data?.message || (editingId ? "Staff member updated" : "Staff member added"))
      HandleCancelEdit()
      FetchStaff()
    } catch (error) {
      console.error("Error submitting form:", error)
      const resData = error.response?.data
      setError(resData ? JSON.stringify(resData) : "Failed to submit form")
    } finally {
      setSubmitting(false)
    }
  }

  const RoleBadge = ({ role }) => {
    const styles = {
      admin: "bg-purple-100 text-purple-700",
      staff: "bg-blue-100 text-blue-700",
    }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[role] || "bg-gray-100 text-gray-700"}`}>
        {role}
      </span>
    )
  }

  return (
    <div className='p-4 md:p-4 space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold mb-4'>Staff Management</h1>
          <p className='text-gray-600'>Manage your staff members</p>
        </div>
        <button
          onClick={HandleToggleForm}
          className='btn-primary  text-white font-bold py-2 px-4 rounded'
        >
          <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"} mr-2`}></i>

          {showForm ? "Close Form" : "Add Staff Member"}
        </button>
      </div>

      {showForm && (
        <div ref={formRef} className="form-card gap-2 max-w-full">
          <h2>{editingId ? "Edit Staff Member" : "Add Staff Member"}</h2>
          <form onSubmit={HandleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="form-label" htmlFor="username">Username</label>
              <input
                className="form-input"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="firstname">First Name</label>
              <input
                className="form-input"
                id="firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="lastname">Last Name</label>
              <input
                className="form-input"
                id="lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="email">Email</label>
              <input
                className="form-input"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="phonenumber">Phone Number</label>
              <input
                className="form-input"
                id="phonenumber"
                type="text"
                value={phonenumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="role">Role</label>
              <select
                className="form-input"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {!editingId && (
              <div>
                <label className="form-label" htmlFor="password">Temporary Password</label>
                <input
                  className="form-input"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            <div className="lg:col-span-3 flex gap-3 mt-4">
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                {submitting ? "Saving..." : editingId ? "Update Staff Member" : "Add Staff Member"}
              </button>
              <button type="button" onClick={HandleCancelEdit} className="btn-secondary ml-2">
                Cancel
              </button>
            </div>

            {message && <div className="alert-success lg:col-span-3">{message}</div>}
            {error && <div className="alert-error lg:col-span-3">{error}</div>}
          </form>
        </div>
      )}

      {loading ? (
        <p className='text-gray-500'>Loading staff...</p>
      ) : staff.length === 0 ? (
        <p className='text-gray-500'>No staff members yet</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4">Staff</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                        {member.first_name?.[0]}{member.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{member.first_name} {member.last_name}</p>
                        <p className="text-sm text-gray-500">@{member.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p>{member.email}</p>
                    <p className="text-sm text-gray-500">{member.phone_number}</p>
                  </td>
                  <td className="p-4">
                    <RoleBadge role={member.role} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => HandleEdit(member)}
                      className="btn-primary hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                      aria-label={`Edit ${member.username}`}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Staff
