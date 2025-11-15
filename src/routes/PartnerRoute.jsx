import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/user.service";
import LoadingOverlay from "../components/common/Loading/LoadingOverlay";
import ConfirmModal from "../components/common/Modal/ConfirmModal";

const PartnerRoute = ({ children }) => {
  console.log("LOG 1: PartnerRoute ĐÃ CHẠY");

  const { currentUser, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Modal thông tin hồ sơ
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    console.log("LOG 2: useEffect chạy", { currentUser });

    // 1. CHƯA ĐĂNG NHẬP → hiển thị modal đăng nhập
    if (!currentUser) {
      console.log("LOG 3A: Chưa đăng nhập → bật modal");
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }

    // 2. ADMIN hoặc OWNER → không được vào PartnerRoute
    if (hasRole("ADMIN") || hasRole("OWNER")) {
      console.log("LOG 3B: ADMIN/OWNER → chuyển hướng");
      navigate(hasRole("ADMIN") ? "/admin/dashboard" : "/owner/dashboard", { replace: true });
      return;
    }

    // 3. CUSTOMER → kiểm tra hồ sơ
    const checkProfile = async () => {
      try {
        console.log("LOG 3C: CUSTOMER → gọi checkProfile()");
        const res = await userService.getProfileStatus();
        console.log("LOG 5: Kết quả API:", res);

        if (res.isProfileComplete) {
          setIsAuthorized(true); 
        } else {
          setShowProfileModal(true); 
        }
      } catch (error) {
        console.error("Lỗi hồ sơ:", error);
        alert("Có lỗi xảy ra khi kiểm tra hồ sơ.");
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [currentUser, hasRole, navigate]);

  // ----------------------------------------------------------------
  // MODAL ĐĂNG NHẬP
  // ----------------------------------------------------------------
  const handleLoginModalConfirm = () => {
    setShowLoginModal(false);

    // === YÊU CẦU 2 ===
    navigate("/login", {
      state: { from: location }, // để quay lại trang trước sau login
      replace: true,
    });
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);

    // Quay lại trang trước
    navigate(-1);
  };

  // ----------------------------------------------------------------
  // MODAL HỒ SƠ
  // ----------------------------------------------------------------
  const handleProfileModalConfirm = () => {
    setShowProfileModal(false);

    // === YÊU CẦU 1 ===
    navigate("/customer/profile", { replace: true });
  };

  const handleProfileModalClose = () => {
    setShowProfileModal(false);

    // Hủy → quay về trang chủ
    navigate("/", { replace: true });
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------

  // 1. Modal yêu cầu đăng nhập
  if (showLoginModal) {
    return (
      <ConfirmModal
        open={true}
        onClose={handleLoginModalClose}
        onConfirm={handleLoginModalConfirm}
        title="Yêu cầu đăng nhập"
        message="Bạn cần đăng nhập để thực hiện chức năng này. Đăng nhập ngay?"
        confirmText="Đăng nhập"
        cancelText="Để sau"
      />
    );
  }

  // 2. Modal yêu cầu bổ sung hồ sơ
  if (showProfileModal) {
    return (
      <ConfirmModal
        open={true}
        onClose={handleProfileModalClose}
        onConfirm={handleProfileModalConfirm}
        title="Hồ sơ chưa hoàn tất"
        type="warning"
        message={
          <div>
            <p className="mb-3">
              Vui lòng cập nhật các thông tin sau trong hồ sơ để tiếp tục:
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <ul className="list-disc list-inside text-sm text-yellow-900">
                <li>Họ</li>
                <li>Tên</li>
                <li>Ngày sinh</li>
                <li>Số điện thoại</li>
                <li>Giới tính</li>
              </ul>
            </div>
          </div>
        }
        confirmText="Tiếp tục"
        cancelText="Hủy"
      />
    );
  }

  // 3. Loading overlay
  if (isLoading) {
    return <LoadingOverlay open={true} />;
  }

  // 4. Chỉ hiển thị children nếu được phép
  return isAuthorized ? children : null;
};

export default PartnerRoute;
