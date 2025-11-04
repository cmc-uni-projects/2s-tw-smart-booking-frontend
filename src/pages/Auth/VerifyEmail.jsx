import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";

// Common Components
import Button from "../../components/common/Button/Button";
import Toast from "../../components/common/Notification/Toast";
import ToastPortal from "../../components/common/Notification/ToastPortal";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // success | error
  const [message, setMessage] = useState("");

  // Toast state
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("info");
  const [showToast, setShowToast] = useState(false);

  const hasVerified = useRef(false);

  const showToastOnce = (msg, type = "error") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Không tìm thấy token xác minh. Vui lòng kiểm tra lại email.");
        setLoading(false);
        showToastOnce("Token xác minh không hợp lệ.", "error");
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus("success");
        setMessage("Email của bạn đã được xác minh thành công! Tài khoản đã được kích hoạt.");
        showToastOnce("🎉 Xác minh email thành công!", "success");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Liên kết xác minh không hợp lệ hoặc đã hết hạn. Vui lòng đăng ký lại."
        );
        showToastOnce("Liên kết xác minh không hợp lệ hoặc đã hết hạn.", "error");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <>
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
              <Loader2
                className="animate-spin text-[rgb(40,169,224)] mx-auto mb-4"
                size={48}
              />
              <h2 className="text-2xl font-extrabold text-[#006494] mb-2">
                Đang xác minh...
              </h2>
              <p className="text-gray-600 text-sm">
                Vui lòng chờ trong giây lát, chúng tôi đang kiểm tra thông tin của bạn.
              </p>
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle2 className="text-green-500 mx-auto mb-4" size={52} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Xác minh thành công!
              </h2>
              <p className="text-gray-600 text-sm mb-6">{message}</p>

              <Button
                onClick={() => navigate("/login")}
                fullWidth
                variant="primary"
              >
                Đăng nhập ngay
              </Button>
            </>
          ) : (
            <>
              <XCircle className="text-red-500 mx-auto mb-4" size={52} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Xác minh thất bại
              </h2>
              <p className="text-gray-600 text-sm mb-6">{message}</p>

              <div className="flex flex-col gap-3 items-center">
                <Button
                  onClick={() => navigate("/register")}
                  fullWidth
                  variant="primary"
                >
                  Đăng ký lại
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate("/login")}
                  leftIcon={<ArrowLeft size={18} />}
                >
                  Quay lại đăng nhập
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ✅ ToastPortal hiển thị dưới cùng */}
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

export default VerifyEmail;
