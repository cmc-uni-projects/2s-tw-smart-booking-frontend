import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx'; //
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import VerifyEmail from './pages/Auth/VerifyEmail.jsx';
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";

import ProtectedRoute from './routes/ProtectedRoute.jsx';
import './styles/global.css';

// Component trang chủ tạm thời để test
const HomePage = () => {
  const { currentUser, logout } = useAuth();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Chào mừng, {currentUser?.email}!</h1>
      <p>Bạn đã đăng nhập thành công.</p>
      <button 
        onClick={logout} 
        style={{ padding: '10px', background: 'red', color: 'white', cursor: 'pointer' }}
      >
        Đăng xuất
      </button>
    </div>
  );
};

function App() {
  const { currentUser } = useAuth(); 

  return (
    <Routes>
      {/* CÁC ĐƯỜNG DẪN CÔNG KHAI (PUBLIC ROUTES) */}
      <Route 
        path="/login" 
        element={
          currentUser ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route 
        path="/register" 
        element={
          currentUser ? <Navigate to="/" replace /> : <Register />
        }
      />
      
      {/* THÊM ĐƯỜNG DẪN MỚI NÀY: */}
      <Route 
        path="/verify-email" 
        element={<VerifyEmail />} 
      />
      <Route 
        path="/forgot-password" 
        element={<ForgotPassword />} 
      />
      <Route 
        path="/reset-password/:token" 
        element={<ResetPassword />} 
      />
      
      {/* CÁC ĐƯỜNG DẪN ĐƯỢC BẢO VỆ (PROTECTED ROUTES) */}
      <Route 
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      
    </Routes>
  );
}

export default App;