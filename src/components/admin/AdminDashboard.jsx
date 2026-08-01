import React from 'react'
import { useState, useEffect } from 'react'
import api from '../context/api/api'

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get("sales/admindashboard/")
      setDashboardData(data)
      console.log(data)
    } catch (error) {
      setError("Failed to fetch dashboard data")
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {loading && <p>Loading...</p>}
    </div>
  )
}
export default AdminDashboard
