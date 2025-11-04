import React, { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import { authService } from "../../services/auth.service";
import Button from "../../components/common/Button/Button";
import Badge from "../../components/common/Badge/Badge";
// TextField không được dùng ở đây vì trường mật khẩu cần nút toggle
// import TextField from "../../components/common/Input/TextField"; 

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8)
      return setError("Mật khẩu phải có ít nhất 8 ký tự.");
    if (password !== confirm)
      return setError("Mật khẩu xác nhận không khớp.");

    setLoading(true);
    try {
      await authService.resetPassword(token, password, confirm);
      setMessage("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Liên kết đặt lại không hợp lệ hoặc đã hết hạn."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
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
          Đặt lại mật khẩu
        </h2>

        {message ? (
          <div className="text-center">
            <CheckCircle2 className="text-green-500 w-14 h-14 mx-auto mb-4" />
            <p className="text-gray-700 text-sm">{message}</p>
            <Link to="/login" className="inline-block mt-6">
              <Button>
                Đi đến đăng nhập
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="text-center">
                <Badge color="danger">{error}</Badge>
              </div>
            )}

            <div className="relative">
              {/* Giữ nguyên input này vì TextField không hỗ trợ toggle */}
              <input
                type={showPw ? "text" : "password"}
                placeholder="Mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A9E0]"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              {/* Giữ nguyên input này vì TextField không hỗ trợ toggle */}
              <input
                type={showPw2 ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A9E0]"
              />
              <button
                type="button"
                onClick={() => setShowPw2((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
              className="w-full"
            >
              {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            </Button>

            {/* Nút quay lại */}
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full"
              leftIcon={<ArrowLeft size={18} />}
            >
              Quay lại đăng nhập
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;