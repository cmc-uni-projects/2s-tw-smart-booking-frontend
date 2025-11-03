import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { authService } from "../../services/auth.service";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
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
    setMsg("");
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);
    try {
      await authService.register(
        form.fullName.trim(),
        form.email.trim(),
        form.password,
        form.confirmPassword,
        form.phoneNumber.trim()
      );
      setMsg("🎉 Đăng ký thành công! Hãy kiểm tra email để xác minh tài khoản.");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-[#696cff] to-indigo-600 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-300/20 blur-3xl rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex w-[900px] h-[560px] bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        <div
          className="hidden lg:flex w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-10 left-8 text-white">
            <h1 className="text-3xl font-bold">TravelMate</h1>
            <p className="text-sm text-gray-200 max-w-xs mt-1">
              Tạo tài khoản để bắt đầu hành trình thông minh.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-10 py-8">
          <img src="/assets/logo/travelmate_logo.png" alt="TravelMate" className="h-14 mb-6 animate-float" />
          <div className="flex items-center mb-4">
            <UserPlus className="text-[#696cff] mr-2" size={26} />
            <h2 className="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h2>
          </div>

          <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {msg && <p className="text-green-600 text-sm">{msg}</p>}

            <input
              name="fullName"
              placeholder="Họ và tên (VD: Nguyễn Văn A)"
              value={form.fullName}
              onChange={onChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#696cff]"
            />

            <input
              name="email"
              type="email"
              inputMode="email"
              placeholder="Email để nhận xác minh (VD: you@example.com)"
              value={form.email}
              onChange={onChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#696cff]"
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Mật khẩu từ 8 ký tự"
                  value={form.password}
                  onChange={onChange}
                  required
                  className="w-full pr-11 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#696cff]"
                />
                <button
                  type="button"
                  aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={onChange}
                  required
                  className="w-full pr-11 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#696cff]"
                />
                <button
                  type="button"
                  aria-label={showPw2 ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  onClick={() => setShowPw2((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPw2 ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <input
              name="phoneNumber"
              inputMode="tel"
              placeholder="Số điện thoại (tùy chọn)"
              value={form.phoneNumber}
              onChange={onChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#696cff]"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#696cff] text-white py-2.5 rounded-lg font-semibold transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5853e0] shadow-sm hover:shadow-md"
              }`}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="text-gray-600 text-sm mt-5">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-[#696cff] hover:underline font-medium">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
