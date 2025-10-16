import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { useSelector } from 'react-redux'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CompanyProfile from './pages/CompanyProfile'
import Settings from './pages/Settings'
import Tasks from './pages/Tasks'

// Components
import Navbar from './components/Navbar'

function App() {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const { isAuthenticated } = useSelector(state => state.auth)

  return (
    <div className={`app ${isMobile ? 'mobile' : 'desktop'}`}>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/company-profile" element={isAuthenticated ? <CompanyProfile /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/tasks" element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App