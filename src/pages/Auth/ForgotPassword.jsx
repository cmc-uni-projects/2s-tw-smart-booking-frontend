import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { authService } from "../../services/auth.service";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setMessage("Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn!");
    } catch (err) {
      setError(err.response?.data?.message || "Không tìm thấy người dùng với email này.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00A8E8]/60 via-[#0090C1]/50 to-[#006494]/70 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-sm bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 animate-fadeIn border border-white/30">
        <img
          src="/assets/logo/logo_travelmate_xoafont.png"
          alt="TravelMate"
          className="h-[164px] w-[164px] mx-auto mb-3 object-contain animate-float"
        />

        <h2 className="text-2xl font-extrabold text-[#006494] text-center mb-5 tracking-tight">
          Quên mật khẩu
        </h2>

        {message ? (
          <div className="text-center">
            <CheckCircle2 className="text-green-500 w-14 h-14 mx-auto mb-4" />
            <p className="text-gray-700 text-sm">{message}</p>
            <Link
              to="/login"
              className="inline-block mt-6 bg-[#28A9E0] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#1b8dc4] transition-all"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A9E0]"
                />
                <Mail
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#28A9E0] text-white py-2.5 rounded-lg font-semibold transition-all ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#1b8dc4] shadow-sm hover:shadow-md"
              }`}
            >
              {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
            </button>

            {/* Nút quay lại */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-2 mt-2 text-[#006494] border border-[#006494]/50 py-2.5 rounded-lg font-medium hover:bg-[#006494]/10 transition-all"
            >
              <ArrowLeft size={18} /> Quay lại đăng nhập
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
