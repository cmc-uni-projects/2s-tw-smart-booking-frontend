import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// ✅ 1. Thêm Check, Circle vào import
import { UserPlus, Mail, ArrowLeft, User, Check, Circle } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { authService } from "../../services/auth.service";

// Common Components
import AuthTextField from "../../components/common/Input/AuthTextField"; 
import PasswordField from "../../components/common/Input/PasswordField";
import ConfirmPasswordField from "../../components/common/Input/ConfirmPasswordField";
import Button from "../../components/common/Button/Button";
import Divider from "../../components/common/Divider/Divider";
import Toast from "../../components/common/Notification/Toast";
import ToastPortal from "../../components/common/Notification/ToastPortal";

// Component SVG cho icon Google (Giữ nguyên)
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

  // ✅ 2. State kiểm tra độ mạnh mật khẩu & Hiển thị Hint
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const [validations, setValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  const showToastOnce = (msg, type = "error") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ 3. Hàm riêng xử lý input mật khẩu để check realtime
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, password: val });

    setValidations({
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(val),
    });
  };

  // Kiểm tra tổng thể
  const isPasswordValid = Object.values(validations).every(Boolean);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      showToastOnce("Vui lòng điền đầy đủ tất cả các trường bắt buộc.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToastOnce("Địa chỉ email không hợp lệ.");
      return;
    }
    
    // ✅ Check độ mạnh password trước khi gửi
    if (!isPasswordValid) {
      showToastOnce("Mật khẩu chưa đủ mạnh (Cần chữ hoa, thường, số, ký tự đặc biệt).");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToastOnce("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      await authService.register(
        form.fullName.trim(),
        form.email.trim(),
        form.password,
        form.confirmPassword
      );
      showToastOnce(
        "🎉 Đăng ký thành công! Hãy kiểm tra email để xác minh tài khoản.",
        "success"
      );
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("Register error:", err);
      showToastOnce(
        err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8386/oauth2/authorization/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:8386/oauth2/authorization/facebook";
  };

  // ✅ Component hiển thị dòng check
  const ValidationItem = ({ fulfilled, text }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors ${fulfilled ? "text-green-600 font-medium" : "text-gray-400"}`}>
      {fulfilled ? <Check size={14} strokeWidth={3} /> : <Circle size={14} />}
      <span>{text}</span>
    </div>
  );

  return (
    <>
      <div
        className="min-h-screen flex justify-center items-center px-6 py-10 bg-cover bg-center bg-no-repeat relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00A8E8]/60 via-[#0090C1]/50 to-[#006494]/70 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col lg:flex-row animate-fadeIn border border-white/30 overflow-hidden max-h-[90vh]">
          {/* Left: Register Form */}
          <div className="w-full lg:w-1/2 p-10 flex flex-col justify-start overflow-y-auto">
            <img
              src="/assets/logo/logo_travelmate_xoafont.png"
              alt="TravelMate"
              className="h-[164px] w-[164px] mx-auto mb-4 object-contain animate-float flex-shrink-0"
            />

            <h2 className="text-2xl font-extrabold text-[#006494] text-center mb-6 tracking-tight flex-shrink-0">
              Tạo tài khoản TravelMate
            </h2>

            <form onSubmit={onSubmit} className="space-y-5">
              <AuthTextField
                name="fullName"
                label="Họ và tên"
                value={form.fullName}
                onChange={onChange}
                required
                icon={<User size={18} />}
              />

              <AuthTextField
                name="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                icon={<Mail size={18} />}
              />

              {/* ✅ MẬT KHẨU CÓ CHECKLIST */}
              <div>
                <PasswordField
                  label="Mật khẩu"
                  value={form.password}
                  onChange={handlePasswordChange} // Sử dụng hàm handle riêng
                  required
                  // Bắt sự kiện focus/blur để hiện/ẩn checklist
                  onFocus={() => setShowPasswordHints(true)}
                  onBlur={() => setShowPasswordHints(false)}
                />
                
                {/* Checklist hiển thị khi focus HOẶC khi đã nhập nhưng chưa đủ mạnh */}
                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    showPasswordHints || (form.password.length > 0 && !isPasswordValid) 
                      ? 'max-h-[200px] opacity-100 mt-3 p-3 border border-gray-200 bg-gray-50 rounded-lg' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                   <div className="grid grid-cols-2 gap-2">
                      <ValidationItem fulfilled={validations.length} text="Tối thiểu 8 ký tự" />
                      <ValidationItem fulfilled={validations.upper} text="Chữ in hoa (A-Z)" />
                      <ValidationItem fulfilled={validations.lower} text="Chữ thường (a-z)" />
                      <ValidationItem fulfilled={validations.number} text="Số (0-9)" />
                      <ValidationItem fulfilled={validations.special} text="Ký tự đặc biệt" />
                   </div>
                </div>
              </div>

              <ConfirmPasswordField
                label="Xác nhận mật khẩu"
                password={form.password}
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
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

            <p className="text-gray-600 text-sm mt-6 text-center flex-shrink-0">
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
                leftIcon={<GoogleIcon className="text-[#db4437]" />}
                fullWidth
              >
                Tiếp tục với Google
              </Button>

              <Button
                style={{ backgroundColor: "#1877F2", color: "white" }}
                onClick={handleFacebookLogin}
                leftIcon={<FaFacebook size={20} />}
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

      {/* ToastPortal */}
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
