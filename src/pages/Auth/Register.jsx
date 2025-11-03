import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Eye, EyeOff, Facebook, Chrome } from "lucide-react";
import { authService } from "../../services/auth.service";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword)
      return setError("Mật khẩu xác nhận không khớp!");
    if (form.password.length < 8)
      return setError("Mật khẩu phải có ít nhất 8 ký tự.");

    setLoading(true);
    try {
      await authService.register(
        form.fullName.trim(),
        form.email.trim(),
        form.password,
        form.confirmPassword
      );
      setMsg("🎉 Đăng ký thành công! Hãy kiểm tra email để xác minh tài khoản.");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.");
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

          <form onSubmit={onSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {msg && <p className="text-green-600 text-sm text-center">{msg}</p>}

            <input
              name="fullName"
              type="text"
              placeholder="Họ và tên"
              value={form.fullName}
              onChange={onChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A9E0]"
            />

            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A9E0]"
            />

            <div className="relative">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                placeholder="Mật khẩu (≥8 ký tự)"
                value={form.password}
                onChange={onChange}
                required
                className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A9E0]"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                name="confirmPassword"
                type={showPw2 ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={form.confirmPassword}
                onChange={onChange}
                required
                className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28A9E0]"
              />
              <button
                type="button"
                onClick={() => setShowPw2((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPw2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#28A9E0] text-white py-3 rounded-lg font-semibold transition-all ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#1b8dc4] shadow-sm hover:shadow-md"
              }`}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
            </button>
          </form>

          <p className="text-gray-600 text-sm mt-6 text-center">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-[#006494] hover:underline font-semibold">
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className="hidden lg:flex w-px bg-gray-300/30 my-10"></div>

        {/* Right: Social Login */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-10 bg-white/80">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Đăng nhập nhanh bằng mạng xã hội
          </h3>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
            >
              <Chrome className="text-[#db4437]" size={20} />
              <span className="text-gray-700 font-medium text-sm">Tiếp tục với Google</span>
            </button>

            <button
              onClick={handleFacebookLogin}
              className="flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#145db2] transition-all"
            >
              <Facebook size={20} />
              <span className="font-medium text-sm">Tiếp tục với Facebook</span>
            </button>
          </div>

          <p className="text-gray-500 text-xs mt-6 text-center max-w-xs leading-snug">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <span className="text-[#006494] hover:underline cursor-pointer">
              Điều khoản dịch vụ
            </span>{" "}
            và{" "}
            <span className="text-[#006494] hover:underline cursor-pointer">
              Chính sách bảo mật
            </span>{" "}
            của TravelMate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
