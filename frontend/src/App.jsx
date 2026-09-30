import { Routes, Route, Navigate } from 'react-router-dom'
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading){
    return <TailChase
      size="40"
      speed="1.75"
      color="black" 
    />;
  }
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
   <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } />
    <Route path="/" element={<Navigate to="/dashboard" />} />
   </Routes>
  )
}

export default App
