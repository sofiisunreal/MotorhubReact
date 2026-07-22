import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NotAuthorized from './components/NotAuthorized'
import NotFound from './components/NotFound'
import LandingPage from './components/LandingPage'

function App() {
  const [count, setCount] = useState(0)
  return (
    < Router >
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path='/not-authorized' element={<NotAuthorized />} />
        <Route path='/' element={<LandingPage />} />
      </Routes>
    </Router >
  )
}

export default App
