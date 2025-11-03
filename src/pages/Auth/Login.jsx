import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plane, Eye, EyeOff } from "lucide-react";
import { authService } from "../../services/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authService.login(email.trim(), pw);
      const { token } = res.data;
      localStorage.setItem("accessToken", token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#696cff] via-blue-500 to-indigo-600 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-300/20 blur-3xl rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex w-[900px] h-[560px] bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        <div
          className="hidden lg:flex w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-10 left-8 text-white">
            <h1 className="text-3xl font-bold">TravelMate</h1>
            <p className="text-sm text-gray-200 max-w-xs mt-1">
              Trải nghiệm du lịch thông minh & trọn vẹn.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-10 py-8">
          <img src="/assets/logo/travelmate_logo.png" alt="TravelMate" className="h-14 mb-6 animate-float" />
          <div className="flex items-center mb-4">
            <Plane className="text-[#696cff] mr-2" size={26} />
            <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
          </div>

          <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input
                autoFocus
                inputMode="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#696cff] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  required
                  className="w-full pr-11 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#696cff] focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <Link to="/forgot-password" className="text-[#696cff] hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#696cff] text-white py-2.5 rounded-lg font-semibold transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5853e0] shadow-sm hover:shadow-md"
              }`}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-gray-600 text-sm mt-5">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-[#696cff] hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
