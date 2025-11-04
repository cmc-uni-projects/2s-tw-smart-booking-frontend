import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button/Button";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return; // ngăn gọi lại khi render lần 2
    hasVerified.current = true;

    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Không tìm thấy token xác minh. Vui lòng kiểm tra lại email.");
        setLoading(false);
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus("success");
        setMessage("Email của bạn đã được xác minh thành công! Tài khoản đã được kích hoạt.");
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
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Overlay xanh biển */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00A8E8]/60 via-[#0090C1]/50 to-[#006494]/70 backdrop-blur-sm"></div>

      {/* Card xác minh */}
      <div className="relative z-10 w-full max-w-sm bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 animate-fadeIn border border-white/30 text-center">
        <img
          src="/assets/logo/logo_travelmate_xoafont.png"
          alt="TravelMate"
          className="h-[164px] w-[164px] mx-auto mb-3 object-contain animate-float"
        />

        {loading ? (
          <>
            <Loader2 className="animate-spin text-[#006494] mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-extrabold text-[#006494] mb-2">Đang xác minh...</h2>
            <p className="text-gray-600 text-sm">
              Vui lòng chờ trong giây lát, chúng tôi đang kiểm tra thông tin của bạn.
            </p>
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 className="text-green-500 mx-auto mb-4" size={52} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác minh thành công!</h2>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            <Link to="/login" className="inline-block">
              <Button>
                Đăng nhập ngay
              </Button>
            </Link>
          </>
        ) : (
          <>
            <XCircle className="text-red-500 mx-auto mb-4" size={52} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác minh thất bại</h2>
            <p className="text-gray-600 text-sm mb-6">{message}</p>

            <div className="flex flex-col gap-3 items-center">
              <Link to="/register" className="w-full">
                <Button className="w-full">
                  Đăng ký lại
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="w-full"
                leftIcon={<ArrowLeft size={18} />}
              >
                Quay lại đăng nhập
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;