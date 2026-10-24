import './App.css'
import { BrowserRouter , Route, Routes} from "react-router-dom"
import Navbar from './component/Navbar'
import { Toaster } from "react-hot-toast"
import Hero from './component/home/Hero'
import About from './component/home/About'
import Footer from './component/Footer'
import Register from './auth/Register'
import Login from './auth/Login'
import VerifyEmail from './auth/VerifyEmail'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import ChangePassword from './auth/ChangePassword'
import FarmerForm from './farmer/FarmerForm'
import ProtectedRoute from './component/ProtectedRoute'
import FarmerDashboard from './farmer/FarmerDashboard'
import OfficerDashboard from './officer/OfficerDashboard'
import AdminDashboard from './admin/AdminDashboard'

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-section" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/farmer/register" element={
          <ProtectedRoute allowedRole="farmer">
            <FarmerForm />
          </ProtectedRoute>
        } />
        <Route path="/farmer/profile" element={
          <ProtectedRoute allowedRole="farmer">
            <FarmerForm />
          </ProtectedRoute>
        } />
        <Route path="/farmer/dashboard" element={
          <ProtectedRoute allowedRole="farmer">
            <FarmerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/officer/dashboard" element={
          <ProtectedRoute allowedRole="officer">
            <OfficerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
