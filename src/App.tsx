import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Coupons from './pages/Coupons'
import AdminDashboard from './pages/AdminDashboard'
import AdminBenefits from './pages/AdminBenefits'
import AdminBenefitEdit from './pages/AdminBenefitEdit'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/benefits" element={<AdminBenefits />} />
        <Route path="/admin/benefits/:id" element={<AdminBenefitEdit />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
