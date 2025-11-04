import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plane, Facebook, Chrome } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Common Components
import TextField from "../../components/common/Input/TextField";
import PasswordField from "../../components/common/Input/PasswordField";
import Button from "../../components/common/Button/Button";
import Divider from "../../components/common/Divider/Divider";
import Toast from "../../components/common/Notification/Toast";
import ToastPortal from "../../components/common/Notification/ToastPortal";

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("info");
  const [showToast, setShowToast] = useState(false);

  // tiện ích show toast chỉ 1 lần
  const showToastOnce = (msg, type = "error") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // ===== Client Validation =====
    if (!email.trim() || !pw.trim()) {
      showToastOnce("Vui lòng điền đầy đủ thông tin.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToastOnce("Email không hợp lệ.", "error");
      return;
    }

    // ===== Backend Request =====
    try {
      const success = await login(email.trim(), pw);
      if (success) {
        navigate("/");
      } else if (authError) {
        showToastOnce(authError, "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      showToastOnce("Đăng nhập thất bại, vui lòng thử lại.", "error");
    }
  };

  // ===== Social Login =====
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/facebook";
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center px-6 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00A8E8]/60 via-[#0090C1]/50 to-[#006494]/70 backdrop-blur-sm"></div>

        <div className="relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col lg:flex-row animate-fadeIn border border-white/30 overflow-hidden">
          {/* Left side - Login Form */}
          <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
            <img
              src="/assets/logo/logo_travelmate_xoafont.png"
              alt="TravelMate"
              className="h-[164px] w-[164px] mx-auto mb-4 object-contain animate-float"
            />

            <h2 className="text-2xl font-extrabold text-[#006494] text-center mb-6 tracking-tight">
              Đăng nhập TravelMate
            </h2>

            <form onSubmit={onSubmit} className="space-y-5">
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <PasswordField
                label="Mật khẩu"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
              />

              <div className="flex justify-end text-sm text-gray-600">
                <Link
                  to="/forgot-password"
                  className="text-[rgb(40,169,224)] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                leftIcon={<Plane size={18} />}
                isLoading={loading}
                fullWidth
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <p className="text-gray-600 text-sm mt-6 text-center">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-[rgb(40,169,224)] hover:underline font-semibold"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          {/* Divider */}
          <Divider vertical className="hidden lg:flex mx-4 my-10 bg-gray-300/30" />

          {/* Right side - Social login */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-10 bg-white/80">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Đăng nhập bằng mạng xã hội
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
                style={{
                  backgroundColor: "#1877F2",
                  color: "white",
                }}
                onClick={handleFacebookLogin}
                leftIcon={<Facebook size={20} />}
                fullWidth
              >
                Tiếp tục với Facebook
              </Button>
            </div>

            <p className="text-gray-500 text-xs mt-6 text-center max-w-xs leading-snug">
              Bằng cách đăng nhập, bạn đồng ý với{" "}
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

export default Login;
