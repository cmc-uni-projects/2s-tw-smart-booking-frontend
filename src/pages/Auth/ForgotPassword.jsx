import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { authService } from "../../services/auth.service";

// Common Components
import TextField from "../../components/common/Input/TextField";
import Button from "../../components/common/Button/Button";
import Toast from "../../components/common/Notification/Toast";
import ToastPortal from "../../components/common/Notification/ToastPortal";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("info");
  const [showToast, setShowToast] = useState(false);

  // Hiển thị toast 1 lần
  const showToastOnce = (msg, type = "error") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // --- Validate ---
    if (!email.trim()) {
      showToastOnce("Vui lòng nhập địa chỉ email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToastOnce("Địa chỉ email không hợp lệ.");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setMessage("✅ Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!");
      showToastOnce("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!", "success");
    } catch (err) {
      showToastOnce(
        err.response?.data?.message || "Không tìm thấy người dùng với email này.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <Button
                onClick={() => navigate("/login")}
                fullWidth
                className="mt-6"
              >
                Quay lại đăng nhập
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <TextField
                label="Địa chỉ email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                fullWidth
                leftIcon={<Mail size={18} />}
              >
                {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
              </Button>

              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate("/login")}
                leftIcon={<ArrowLeft size={18} />}
              >
                Quay lại đăng nhập
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* ✅ ToastPortal — Toast global */}
      <ToastPortal>
        {showToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
            <Toast message={toastMsg} type={toastType} />
          </div>
        )}
      </ToastPortal>
    </>
  );
};

export default ForgotPassword;
