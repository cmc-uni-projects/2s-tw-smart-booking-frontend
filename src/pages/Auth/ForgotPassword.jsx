import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { authService } from "../../services/auth.service";
import Button from "../../components/common/Button/Button";
import TextField from "../../components/common/Input/TextField";
import Badge from "../../components/common/Badge/Badge";

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
            <Link to="/login" className="mt-6 inline-block">
              <Button>
                Quay lại đăng nhập
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

            <TextField
              label="Địa chỉ email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail size={18} />}
            />

            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
              className="w-full"
            >
              {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
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

export default ForgotPassword;