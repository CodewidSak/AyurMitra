import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Login from './features/auth/pages/LoginNew'
import Register from './features/auth/pages/RegisterNew'
import Dashboard from './features/dashboard/pages/DashboardProfessional'
import Consultation from './features/consultation/pages/ConsultationFixed'
import Results from './features/consultation/pages/Results'
import HerbLibrary from './features/herbs/pages/HerbLibrary'
import Profile from './features/profile/pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/results" element={<Results />} />
          <Route path="/remedies" element={<HerbLibrary />} />
          <Route path="/herbs" element={<HerbLibrary />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
