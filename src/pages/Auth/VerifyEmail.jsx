import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Không tìm thấy token xác minh. Vui lòng kiểm tra lại email của bạn.");
        setLoading(false);
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus("success");
        setMessage("✅ Email của bạn đã được xác minh thành công! Tài khoản đã được kích hoạt.");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Liên kết xác minh không hợp lệ hoặc đã hết hạn. Vui lòng đăng ký lại."
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-[#696cff] to-indigo-600 overflow-hidden">
      {/* Hiệu ứng nền */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-300/20 blur-3xl rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-[520px] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 text-center animate-fadeIn">
        <img
          src="/assets/logo/travelmate_logo.png"
          alt="TravelMate"
          className="h-14 mb-6 mx-auto animate-float"
        />

        {loading ? (
          <>
            <Loader2 className="animate-spin text-[#696cff] mx-auto mb-3" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang xác minh email...</h2>
            <p className="text-gray-600 text-sm">
              Vui lòng đợi trong giây lát. Chúng tôi đang kiểm tra thông tin xác minh của bạn.
            </p>
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 className="text-green-500 mx-auto mb-3" size={52} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác minh thành công!</h2>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-[#696cff] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#5853e0] transition-all"
            >
              Đi đến trang đăng nhập
            </Link>
          </>
        ) : (
          <>
            <XCircle className="text-red-500 mx-auto mb-3" size={52} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác minh thất bại</h2>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            <Link
              to="/register"
              className="inline-block bg-[#696cff] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#5853e0] transition-all"
            >
              Đăng ký lại
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
