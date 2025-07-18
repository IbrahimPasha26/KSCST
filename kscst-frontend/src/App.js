"use client"

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import TraineeRegister from './components/TraineeRegister'
import TrainerRegister from './components/TrainerRegister'
import AdminDashboard from './components/AdminDashboard'
import TrainerDashboard from './components/TrainerDashboard'
import TraineeDashboard from './components/TraineeDashboard'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import DashboardHeader from './components/DashboardHeader'
import Footer from './components/Footer'

function Layout() {
  const location = useLocation()
  const isHomePage = location.pathname === "/"
  const isDashboard = ["/admin/dashboard", "/trainer/dashboard", "/trainee/dashboard"].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      {isDashboard ? <DashboardHeader /> : <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/trainee/register" element={<TraineeRegister />} />
          <Route path="/trainer/register" element={<TrainerRegister />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['trainer', 'TRAINER']}>
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainee/dashboard"
            element={
              <ProtectedRoute allowedRoles={['trainee', 'TRAINEE']}>
                <TraineeDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isHomePage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  )
}

export default App