import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NotAuthorized from './components/NotAuthorized'
import NotFound from './components/NotFound'
import LandingPage from './components/LandingPage'
import ProtectedRoute from './components/context/ProtectedRoute'
import Login from './components/Login'
import { AuthProvider } from './components/context/AuthContext'
import StaffLayout from './components/staff/StaffLayout'
import AdminLayout from './components/admin/AdminLayout'
import Settings from './components/Settings'
import Supplier from './components/admin/Supplier'
import Cars from './components/admin/Cars'
import Staff from './components/admin/Staff'
import Sales from './components/admin/Sales'
import Notices from './components/admin/Notices'
import AdminDashboard from './components/admin/AdminDashboard'
import CarsStaff from './components/staff/CarsStaff'
import SalesStaff from './components/staff/SalesStaff'
import NoticesStaff from './components/staff/NoticesStaff'
import StaffDashboard from './components/staff/StaffDashboard'
import { ToastContainer } from 'react-toastify'
import AddSale from './components/staff/AddSale'

function App() {

  return (
    <Router>

      <AuthProvider>
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false} />

        <Routes>

          {/* Staff */}
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <StaffLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StaffDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings" element={<Settings />} />
            <Route path='cars' element={<CarsStaff />} />
            <Route path='sales' element={<SalesStaff />} />
            <Route path='notices' element={<NoticesStaff />} />
            <Route path='addsale/:id' element={<AddSale />} />

          </Route>

          {/* Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path='supplier' element={<Supplier />} />
            <Route path='cars' element={<Cars />} />
            <Route path="staff" element={<Staff />} />
            <Route path="sales" element={<Sales />} />
            <Route path="notices" element={<Notices />} />
          </Route>

          <Route path="/login" element={<Login />} />

          <Route
            path="/not-authorized"
            element={<NotAuthorized />}
          />

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </AuthProvider>

    </Router>
  )
}

export default App
