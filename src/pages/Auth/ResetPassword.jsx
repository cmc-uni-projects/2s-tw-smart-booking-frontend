import React, { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { authService } from "../../services/auth.service";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");
    if (!token) return setErr("Token không hợp lệ hoặc đã hết hạn.");
    if (pw1 !== pw2) return setErr("Mật khẩu xác nhận không khớp!");

    setLoading(true);
    try {
      await authService.resetPassword(token, pw1, pw2);
      setMsg("✅ Đổi mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErr(error.response?.data?.message || "Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-[#696cff] to-indigo-600">
      <div className="w-[520px] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 animate-fadeIn">
        <div className="flex items-center mb-4">
          <LockKeyhole className="text-[#696cff] mr-2" size={26} />
          <h2 className="text-2xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {msg && <p className="text-green-600 text-sm">{msg}</p>}
          {err && <p className="text-red-500 text-sm">{err}</p>}

          <div className="relative">
            <input
              type={show1 ? "text" : "password"}
              placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
              required
              className="w-full pr-11 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#696cff]"
            />
            <button
              type="button"
              aria-label={show1 ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShow1((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {show1 ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={show2 ? "text" : "password"}
              placeholder="Xác nhận mật khẩu mới"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              required
              className="w-full pr-11 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#696cff]"
            />
            <button
              type="button"
              aria-label={show2 ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShow2((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {show2 ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#696cff] text-white py-2.5 rounded-lg font-semibold transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5853e0] shadow-sm hover:shadow-md"
            }`}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          <Link to="/login" className="text-[#696cff] hover:underline">Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
