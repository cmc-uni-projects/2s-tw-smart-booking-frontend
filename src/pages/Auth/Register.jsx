import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, ArrowLeft } from "lucide-react";
import { authService } from "../../services/auth.service";
import { FaFacebook } from "react-icons/fa";

// Common Components
import AuthTextField from "../../components/common/Input/AuthTextField";
import PasswordField from "../../components/common/Input/PasswordField";
import ConfirmPasswordField from "../../components/common/Input/ConfirmPasswordField";
import Button from "../../components/common/Button/Button";
import Divider from "../../components/common/Divider/Divider"; // Nhớ import Divider
import Toast from "../../components/common/Notification/Toast";
import ToastPortal from "../../components/common/Notification/ToastPortal";

// Component Icon Google (Giống bên Login)
const GoogleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="20px"
    height="20px"
    className={className}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,35.619,44,30.397,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp!", "error");
      return;
    }

    setLoading(true);
    try {
      await authService.register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      showToast("Đăng ký thành công! Đang chuyển hướng...", "success");
      setTimeout(() => navigate("/verify-email"), 1500);
    } catch (err) {
      showToast(err.message || "Đăng ký thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xử lý Đăng ký/Login Google/FB (Cổng 8386)
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8386/oauth2/authorization/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:8386/oauth2/authorization/facebook";
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center px-6 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00A8E8]/60 via-[#0090C1]/50 to-[#006494]/70 backdrop-blur-sm"></div>

        <div className="relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col lg:flex-row animate-fadeIn border border-white/30 overflow-hidden">
          
          {/* Left Side: Register Form */}
          <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-extrabold text-[#006494] text-center mb-6 tracking-tight">
              Đăng ký tài khoản
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AuthTextField
                name="fullName"
                label="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                required
                icon={<User size={18} />}
              />

              <AuthTextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                icon={<Mail size={18} />}
              />

              <PasswordField
                name="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <ConfirmPasswordField
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                passwordValue={formData.password}
              />

              <Button type="submit" isLoading={loading} fullWidth size="lg">
                Đăng ký
              </Button>

              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate("/")}
                leftIcon={<ArrowLeft size={18} />}
              >
                Quay lại trang chủ
              </Button>
            </form>

            <p className="text-gray-600 text-sm mt-6 text-center">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-[rgb(40,169,224)] hover:underline font-semibold">
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* Divider */}
          <Divider vertical className="hidden lg:flex mx-4 my-10 bg-gray-300/30" />

          {/* Right Side: Social Login */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-10 bg-white/80">
            <img
              src="/assets/logo/logo_travelmate_xoafont.png"
              alt="TravelMate"
              className="h-[120px] w-[120px] mb-6 object-contain animate-float"
            />
            
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Hoặc đăng ký nhanh với
            </h3>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                leftIcon={<GoogleIcon className="text-[#db4437]" />}
                fullWidth
              >
                Đăng ký với Google
              </Button>

              <Button
                style={{
                  backgroundColor: "#1877F2",
                  color: "white",
                }}
                onClick={handleFacebookLogin}
                leftIcon={<FaFacebook size={20} />}
                fullWidth
              >
                Đăng ký với Facebook
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

      <ToastPortal>
        {toast.show && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
            <Toast message={toast.message} type={toast.type} />
          </div>
        )}
      </ToastPortal>
    </>
  );
};

export default Register;