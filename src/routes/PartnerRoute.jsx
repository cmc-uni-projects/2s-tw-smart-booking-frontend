import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/user.service";
import LoadingOverlay from "../components/common/Loading/LoadingOverlay";
import ConfirmModal from "../components/common/Modal/ConfirmModal";

const PartnerRoute = ({ children }) => {
  // === DEBUG LOG 1 ===
  console.log("LOG 1: PartnerRoute ĐÃ CHẠY");

  const { currentUser, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // === DEBUG LOG 2 ===
    console.log("LOG 2: useEffect ĐÃ CHẠY", { currentUser });

    // === CHECK 1: CHƯA ĐĂNG NHẬP ===
    if (!currentUser) {
      console.log("LOG 3A: Chưa đăng nhập -> Hiển thị Modal");
      setShowLoginModal(true); 
      setIsLoading(false);     
      return;                  
    }

    // === CHECK 2: VAI TRÒ KHÔNG PHẢI LÀ CUSTOMER ===
    if (hasRole("ADMIN") || hasRole("OWNER")) {
      console.log("LOG 3B: Là ADMIN/OWNER -> Chuyển hướng");
      navigate(hasRole("ADMIN") ? "/admin/dashboard" : "/owner/dashboard", { replace: true });
      return;
    }

    // === CHECK 3: LÀ CUSTOMER -> KIỂM TRA HỒ SƠ (GỌI API) ===
    const checkProfile = async () => {
      try {
        // === DEBUG LOG 3 ===
        console.log("LOG 3C: Là CUSTOMER -> Đang gọi checkProfile()...");
        
        // === DEBUG LOG 4 ===
        // (Nếu bạn không thấy log này, nghĩa là userService.getProfileStatus BỊ LỖI)
        console.log("LOG 4: Chuẩn bị gọi API 'userService.getProfileStatus'");
        
        const res = await userService.getProfileStatus(); 
        
        console.log("LOG 5: Đã gọi API, kết quả:", res);

        if (res.isProfileComplete) {
          setIsAuthorized(true); // Hồ sơ OK, cho phép vào
        } else {
          // Hồ sơ chưa hoàn tất
          alert(
            "Vui lòng hoàn tất hồ sơ cá nhân (Họ, Tên, SĐT, Giới tính, Ngày sinh) trước khi đăng ký làm đối tác."
          );
          navigate("/customer/profile", { replace: true });
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra hồ sơ (LOG 6):", error);
        alert("Có lỗi xảy ra khi kiểm tra hồ sơ của bạn.");
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();

  }, [currentUser, hasRole, navigate]);

  // (Các hàm modal... giữ nguyên)
  const handleModalConfirm = () => {
    setShowLoginModal(false);
    navigate("/login", { state: { from: location }, replace: true });
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    navigate(-1); 
  };

  // (Logic render... giữ nguyên)
  if (showLoginModal) {
    return (
      <ConfirmModal
        open={true}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title="Yêu cầu đăng nhập"
        message="Bạn cần đăng nhập để thực hiện chức năng này. Bạn có muốn đăng nhập ngay?"
        confirmText="Đăng nhập"
        cancelText="Để sau"
      />
    );
  }
  if (isLoading) {
    return <LoadingOverlay open={true} />;
  }
  return isAuthorized ? children : null;
};

export default PartnerRoute;