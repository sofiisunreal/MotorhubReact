import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NotAuthorized from './components/NotAuthorized'
import NotFound from './components/NotFound'
import LandingPage from './components/LandingPage'
import ProtectedRoute from './components/context/ProtectedRoute'
import Login from './components/Login'
import { AuthProvider } from './components/context/AuthContext'

function App() {
  const [count, setCount] = useState(0)
  return (
    < Router >
      <AuthProvider>

        <Routes>
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
