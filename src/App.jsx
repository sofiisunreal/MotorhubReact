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

function App() {

  return (
    <Router>

      <AuthProvider>

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
            <Route
              path="settings"
              element={<Settings />}
            />
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
            <Route
              path="settings"
              element={<Settings />}
            />
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
