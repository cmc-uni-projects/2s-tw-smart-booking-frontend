import React, { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { authService } from "../../services/auth.service";

// Common Components
import PasswordField from "../../components/common/Input/PasswordField";
import ConfirmPasswordField from "../../components/common/Input/ConfirmPasswordField";
import Button from "../../components/common/Button/Button";
import Toast from "../../components/common/Notification/Toast";
import ToastPortal from "../../components/common/Notification/ToastPortal";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("error");
  const [showToast, setShowToast] = useState(false);

  const showToastOnce = (msg, type = "error") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // ===== Validate =====
    if (!password || !confirm) {
      showToastOnce("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }
    if (password.length < 8) {
      showToastOnce("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    if (password !== confirm) {
      showToastOnce("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password, confirm);
      setMessage("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
      showToastOnce("🎉 Đặt lại mật khẩu thành công!", "success");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("Reset error:", err);
      showToastOnce(
        err.response?.data?.message ||
          "Liên kết đặt lại không hợp lệ hoặc đã hết hạn.",
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
              <Button
                onClick={() => navigate("/login")}
                fullWidth
                className="mt-6"
              >
                Đi đến đăng nhập
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <PasswordField
                label="Mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <ConfirmPasswordField
                label="Xác nhận mật khẩu"
                password={password}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />

              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                fullWidth
              >
                {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
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

      {/* ✅ ToastPortal hiển thị dưới cùng màn hình */}
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

export default ResetPassword;
