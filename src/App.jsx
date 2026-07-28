import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NotAuthorized from './components/NotAuthorized'
import NotFound from './components/NotFound'
import LandingPage from './components/LandingPage'
import ProtectedRoute from './components/context/ProtectedRoute'
import Login from './components/Login'
import { AuthProvider } from './components/context/AuthContext'
import StaffLayout from './components/staff/StaffLayout'
import StaffDashboard from './components/staff/StaffDashboard'
import AdminLayout from './components/admin/AdminLayout'

function App() {
  const [count, setCount] = useState(0)
  return (
    < Router >
      <AuthProvider>

        <Routes>
          <Route path='staff-dashboard' element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffLayout />
            </ProtectedRoute>
          }>
          </Route>
          <Route path='admin-dashboard' element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }>
          </Route>
          {/* staff */}
          <Route path="*" element={<NotFound />} />
          <Route path='/login' element={<Login />} />
          <Route path='/not-authorized' element={<NotAuthorized />} />
          <Route path='/' element={<LandingPage />} />
        </Routes>
      </AuthProvider>
    </Router >
  )
}

export default App
