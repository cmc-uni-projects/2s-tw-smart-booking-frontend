import React, { useState } from "react";
import { authService } from "../../services/auth.service";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setMsg("✅ Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.");
    } catch (error) {
      setErr(error.response?.data?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-[#696cff] to-blue-500">
      <div className="w-[520px] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 animate-fadeIn">
        <div className="flex items-center mb-4">
          <Mail className="text-[#696cff] mr-2" size={26} />
          <h2 className="text-2xl font-bold text-gray-800">Quên mật khẩu</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Nhập địa chỉ email đã đăng ký. TravelMate sẽ gửi cho bạn liên kết đặt lại mật khẩu.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {msg && <p className="text-green-600 text-sm">{msg}</p>}
          {err && <p className="text-red-500 text-sm">{err}</p>}
          <input
            autoFocus
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#696cff]"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#696cff] text-white py-2.5 rounded-lg font-semibold transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5853e0] shadow-sm hover:shadow-md"
            }`}
          >
            {loading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          <Link to="/login" className="text-[#696cff] hover:underline">Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
