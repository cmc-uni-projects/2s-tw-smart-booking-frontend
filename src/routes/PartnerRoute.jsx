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
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // State để lưu danh sách trường thiếu
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    console.log("LOG 2: useEffect chạy", { currentUser });

    // 1. CHƯA ĐĂNG NHẬP
    if (!currentUser) {
      console.log("LOG 3A: Chưa đăng nhập → bật modal");
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }

    // 2. ADMIN hoặc OWNER
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
        console.log("LOG 5: Kết quả API:", res); // {profileComplete: true, ...}

        // ✅ SỬA LỖI 1: Sửa 'isProfileComplete' thành 'profileComplete'
        if (res.profileComplete) {
          setIsAuthorized(true); 
        } else {
          setMissingFields(res.missingFields || ["Thông tin không xác định"]);
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

  // (Các hàm xử lý modal giữ nguyên)
  const handleLoginModalConfirm = () => {
    setShowLoginModal(false);
    navigate("/login", {
      state: { from: location },
      replace: true,
    });
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    navigate(-1);
  };

  const handleProfileModalConfirm = () => {
    setShowProfileModal(false);
    navigate("/customer/profile", { replace: true });
  };

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
    navigate("/", { replace: true });
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------

  // 1. Modal yêu cầu đăng nhập (Giữ nguyên)
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
        
        // ✅ SỬA LỖI 2: Sửa lỗi HTML lồng nhau
        // Thay thế <p>, <div>, <ul> bằng các thẻ <span> (inline)
        // để chúng có thể nằm bên trong thẻ <p> của ConfirmModal
        message={
          <div className="text-left"> {/* Dùng <div> thay vì <React.Fragment> để đảm bảo layout */}
            <span className="mb-3 block"> {/* Dùng <span> + block thay vì <p> */}
              Vui lòng cập nhật các thông tin sau trong hồ sơ để tiếp tục:
            </span>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <ul className="list-disc list-inside text-sm text-yellow-900">
                {missingFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </div>
          </div>
        }
        confirmText="Tiếp tục"
        cancelText="Hủy"
      />
    );
  }

  // 3. Loading overlay (Giữ nguyên)
  if (isLoading) {
    return <LoadingOverlay open={true} />;
  }

  // 4. Chỉ hiển thị children nếu được phép (Giữ nguyên)
  return isAuthorized ? children : null;
};

export default PartnerRoute;