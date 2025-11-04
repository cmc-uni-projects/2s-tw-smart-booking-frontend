import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Facebook, Chrome } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button/Button";
import TextField from "../../components/common/Input/TextField";
import PasswordField from "../../components/common/Input/PasswordField"; // MỚI
import Badge from "../../components/common/Badge/Badge";

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  // const [showPw, setShowPw] = useState(false); // Không cần nữa

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(email.trim(), pw);
      if (success) navigate("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/facebook";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00A8E8]/60 via-[#0090C1]/50 to-[#006494]/70 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col lg:flex-row animate-fadeIn border border-white/30 overflow-hidden">
        {/* Left side - Login Form */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
          <img
            src="/assets/logo/logo_travelmate_xoafont.png"
            alt="TravelMate"
            className="h-[164px] w-[164px] mx-auto mb-4 object-contain animate-float"
          />

          <h2 className="text-2xl font-extrabold text-[#006494] text-center mb-6 tracking-tight">
            Đăng nhập TravelMate
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            {authError && (
              <div className="text-center">
                <Badge color="danger">{authError}</Badge>
              </div>
            )}

            <TextField
              label="Email của bạn"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required // THÊM REQUIRED
            />

            <PasswordField
              label="Mật khẩu"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required // THÊM REQUIRED
            />

            <div className="flex justify-end text-sm text-gray-600">
              <Link to="/forgot-password" className="text-[#006494] hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
              className="w-full"
              variant="primary" // CẬP NHẬT VARIANT
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <p className="text-gray-600 text-sm mt-6 text-center">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-[#006494] hover:underline font-semibold">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* ... (Phần social login bên phải giữ nguyên) ... */}
        <div className="hidden lg:flex w-px bg-gray-300/30 my-10"></div>
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-10 bg-white/80">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Đăng nhập bằng mạng xã hội
          </h3>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {/* (Giữ nguyên các nút social) */}
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
            >
              <Chrome className="text-[#db4437]" size={20} />
              <span className="text-gray-700 font-medium text-sm">Tiếp tục với Google</span>
            </button>
            <button
              onClick={handleFacebookLogin}
              className="flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#145db2] transition-all"
            >
              <Facebook size={20} />
              <span className="font-medium text-sm">Tiếp tục với Facebook</span>
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-6 text-center max-w-xs leading-snug">
            {/* ... (Giữ nguyên text) ... */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;