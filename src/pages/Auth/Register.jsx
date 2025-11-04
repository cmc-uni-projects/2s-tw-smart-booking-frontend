import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Facebook, Chrome } from "lucide-react";
import { authService } from "../../services/auth.service";

// Common Components
import TextField from "../../components/common/Input/TextField";
import PasswordField from "../../components/common/Input/PasswordField";
import ConfirmPasswordField from "../../components/common/Input/ConfirmPasswordField";
import Button from "../../components/common/Button/Button";
import Divider from "../../components/common/Divider/Divider";
import Toast from "../../components/common/Notification/Toast";
import ToastPortal from "../../components/common/Notification/ToastPortal";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("info");
  const [showToast, setShowToast] = useState(false);

  // tiện ích hiển thị toast một lần
  const showToastOnce = (msg, type = "error") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    // ===== CLIENT VALIDATION =====
    if (!form.fullName.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      showToastOnce("Vui lòng điền đầy đủ tất cả các trường bắt buộc.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToastOnce("Địa chỉ email không hợp lệ.");
      return;
    }

    if (form.password.length < 8) {
      showToastOnce("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToastOnce("Mật khẩu xác nhận không khớp!");
      return;
    }

    // ===== BACKEND REQUEST =====
    setLoading(true);
    try {
      await authService.register(
        form.fullName.trim(),
        form.email.trim(),
        form.password,
        form.confirmPassword
      );
      showToastOnce("🎉 Đăng ký thành công! Hãy kiểm tra email để xác minh tài khoản.", "success");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("Register error:", err);
      showToastOnce(err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/facebook";
  };

  return (
    <>
      <div
        className="min-h-screen flex justify-center px-6 py-10 bg-cover bg-center bg-no-repeat relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00A8E8]/60 via-[#0090C1]/50 to-[#006494]/70 backdrop-blur-sm"></div>

        <div className="relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col lg:flex-row animate-fadeIn border border-white/30 overflow-hidden">
          {/* Left: Register Form */}
          <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center overflow-y-auto max-h-[90vh]">
            <img
              src="/assets/logo/logo_travelmate_xoafont.png"
              alt="TravelMate"
              className="h-[164px] w-[164px] mx-auto mb-4 object-contain animate-float"
            />

            <h2 className="text-2xl font-extrabold text-[#006494] text-center mb-6 tracking-tight">
              Tạo tài khoản TravelMate
            </h2>

            <form onSubmit={onSubmit} className="space-y-5">
              <TextField
                name="fullName"
                label="Họ và tên"
                value={form.fullName}
                onChange={onChange}
                required
              />

              <TextField
                name="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
              />

              <PasswordField
                label="Mật khẩu (≥8 ký tự)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              <ConfirmPasswordField
                label="Xác nhận mật khẩu"
                password={form.password}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />

              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                leftIcon={<UserPlus size={18} />}
                fullWidth
              >
                {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
              </Button>
            </form>

            <p className="text-gray-600 text-sm mt-6 text-center">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-[rgb(40,169,224)] hover:underline font-semibold"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {/* Divider */}
          <Divider vertical className="hidden lg:flex mx-4 my-10 bg-gray-300/30" />

          {/* Right: Social Login */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-10 bg-white/80">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Đăng nhập nhanh bằng mạng xã hội
            </h3>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                leftIcon={<Chrome className="text-[#db4437]" size={20} />}
                fullWidth
              >
                Tiếp tục với Google
              </Button>

              <Button
                style={{ backgroundColor: "#1877F2", color: "white" }}
                onClick={handleFacebookLogin}
                leftIcon={<Facebook size={20} />}
                fullWidth
              >
                Tiếp tục với Facebook
              </Button>
            </div>

            <p className="text-gray-500 text-xs mt-6 text-center max-w-xs leading-snug">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <span className="text-[rgb(40,169,224)] hover:underline cursor-pointer">
                Điều khoản dịch vụ
              </span>{" "}
              và{" "}
              <span className="text-[rgb(40,169,224)] hover:underline cursor-pointer">
                Chính sách bảo mật
              </span>{" "}
              của TravelMate.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ ToastPortal hiển thị trên cùng */}
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

export default Register;
