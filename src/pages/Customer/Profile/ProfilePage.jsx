// ✅ SỬA 1: Thêm 'useCallback', 'Phone', 'Info'
import React, { useState, useEffect, useCallback } from "react"; 
// ❌ SỬA 2: Xóa CustomerLayout (gây lỗi trang trắng)
// import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout"; 

// ✅ SỬA 3: THAY THẾ TextField BẰNG StyledTextField
import StyledTextField from "@/components/common/Input/StyledTextField"; 
// ❌ import TextField from "@/components/common/Input/TextField"; 

// ❌ SỬA 4: Xóa Select cũ
// import Select from "@/components/common/Select/Select"; 
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import SettingsPage from "./SettingsPage";
import ChangePassword from "./ChangePassword";
// ❌ SỬA 5: Xóa Modal điện thoại
// import AddPhoneModal from "./AddPhoneModal"; 
import AccountMenu from "./AccountMenu";
// ✅ SỬA 1 (tiếp): Thêm 'Phone', 'Info'
import { Save, X, Phone, MapPin, Flag, Building, Info } from "lucide-react"; 
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import DateOfBirthInput from "@/components/common/Input/DateOfBirthInput";
// ✅ SỬA 1 (tiếp): Import CustomSelect mới
import CustomSelect from "@/components/common/Select/CustomSelect"; 

const PROFILE_TABS = [
  { id: "info", name: "Thông tin tài khoản" },
  { id: "security", name: "Mật khẩu & Bảo mật" },
];

const ProfilePage = () => {
  const { currentUser, updateUser } = useAuth();

  // --- State UI ---
  const [activeTab, setActiveTab] = useState("info");
  const [activeSection, setActiveSection] = useState("account-settings");
  // ❌ SỬA 6: Xóa state modal
  // const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "info" });
  const [error, setError] = useState(null); 

  // --- State Dữ liệu ---
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    userdetailId: null,
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: null, 
    address: "",
    city: "",
    country: "",
    profilePhotoUrl: "",
  });

  // --- Helper: Map dữ liệu API -> Form ---
  const mapDataToForm = (data) => ({
    userdetailId: data.userdetailId,
    fullName: data.fullName || "",
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    gender: data.gender || "",
    birthDate: data.birthDate || null, 
    address: data.address || "",
    city: data.city || "",
    country: data.country || "",
    profilePhotoUrl: data.profilePhotoUrl || "",
  });

  // --- Helper: Toast ---
  const showToastAndDismiss = (msg, type = "info", duration = 3000) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), duration);
  };

  // --- 1. Fetch Profile (✅ SỬA LỖI: Dùng đúng tên hàm) ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);
        // ✅ LỖI LÀ Ở ĐÂY: Sửa 'getMyProfile' thành 'getUserDetail'
        const profileData = await userService.getUserDetail(); 

        if (profileData) {
          const mapped = mapDataToForm(profileData);
          setUserData(mapped);
          setFormData(mapped);
        } else {
           throw new Error("Không nhận được dữ liệu hồ sơ");
        }

      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError(error.message || "Lỗi kết nối máy chủ");
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  // --- Handlers Form ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => setFormData(userData);

  const isFormDirty = () => JSON.stringify(formData) !== JSON.stringify(userData);

  // ✅ SỬA 7: BỌC HÀM 'onChange' TRONG 'useCallback'
  // (Đây là phần quan trọng để chống lặp vô hạn)
  const handleDateChange = useCallback((dateString) => {
    setFormData((prev) => ({ ...prev, birthDate: dateString }));
  }, []); 

  // --- 2. Xử lý Upload Avatar (Giữ nguyên) ---
  const handleAvatarUpload = async (file) => {
    setIsUploadingAvatar(true);
    try {
      const res = await userService.uploadAvatar(file);
      
      if (res.success && res.data) {
        const newUrl = res.data.profilePhotoUrl;
        
        setFormData(prev => ({ ...prev, profilePhotoUrl: newUrl }));
        setUserData(prev => ({ ...prev, profilePhotoUrl: newUrl }));
        
        updateUser({ profilePhotoUrl: newUrl });

        showToastAndDismiss("Cập nhật ảnh đại diện thành công!", "success");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      const msg = err.response?.data?.message || "Lỗi khi tải ảnh lên.";
      showToastAndDismiss(msg, "error");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // --- 3. Lưu Thông Tin (Giữ nguyên) ---
  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showToastAndDismiss("Họ tên không được để trống", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await userService.updateProfile(formData);

      if (res.data.success) {
        const updatedData = res.data.data;
        const newUserData = mapDataToForm(updatedData);
        
        setUserData(newUserData);
        setFormData(newUserData);
        
        if (updatedData.fullName !== currentUser.fullName) {
            updateUser({ fullName: updatedData.fullName });
        }

        showToastAndDismiss("Lưu thông tin thành công!", "success");
      }
    } catch (err) {
      console.error("Save error:", err);

      if (err.response && err.response.status === 409) {
        try {
          // ✅ SỬA 8: SỬA LỖI LOGIC 409 (Dùng đúng tên hàm)
          // Sửa 'getMyProfile' thành 'getUserDetail'
          const refreshData = await userService.getUserDetail(); 
          if (refreshData && refreshData.userdetailId) { 
            const realId = refreshData.userdetailId;
            const retryData = { ...formData, userdetailId: realId };
            
            const retryRes = await userService.updateProfile(retryData);
            if (retryRes.data.success) {
              const newUserData = mapDataToForm(retryRes.data.data);
              setUserData(newUserData);
              setFormData(newUserData);
              
              if (retryRes.data.data.fullName !== currentUser.fullName) {
                updateUser({ fullName: retryRes.data.data.fullName });
              }

              showToastAndDismiss("Đã đồng bộ và cập nhật thành công!", "success");
              return;
            }
          }
        } catch (retryErr) {
          console.error("Auto-recovery failed:", retryErr);
        }
      }

      const errorMsg = err.response?.data?.message || "Có lỗi xảy ra khi lưu.";
      showToastAndDismiss(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // ❌ SỬA 9: Xóa toàn bộ hàm 'handleSaveNewPhone'

  // --- RENDER UI ---

  const renderInfoTab = () => {
    const GENDER_OPTIONS = [
      { label: "Nam", value: "Nam" },
      { label: "Nữ", value: "Nữ" },
      { label: "Khác", value: "Khác" },
    ];
    const dirty = isFormDirty();

    // ✅ HÀM MỚI: Helper để tạo label có dấu *
    const requiredLabel = (text) => (
      <span>
        {text} <span className="text-red-500">*</span>
      </span>
    );

    return (
      <div className="space-y-10">
        <Card>
          <div className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-4">
              Dữ liệu cá nhân
            </h3>
            
            {/* ✅ YÊU CẦU 1: THÊM DÒNG THÔNG BÁO */}
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg">
              <Info size={20} className="flex-shrink-0" />
              <p className="text-sm italic">
                Nếu bạn muốn đăng ký trở thành "Chủ sở hữu", hãy điền các trường có dấu *.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* ✅ SỬA 10: DÙNG StyledTextField */}
              <StyledTextField
                label={requiredLabel("Họ và tên")}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên của bạn"
              />

              {/* ✅ SỬA 10: DÙNG StyledTextField */}
              <StyledTextField
                label={requiredLabel("Số điện thoại")}
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                icon={<Phone size={16} />}
                placeholder="Nhập số điện thoại"
              />

              <DateOfBirthInput
                label={requiredLabel("Ngày sinh")}
                value={formData.birthDate}
                onChange={handleDateChange} 
              />

              <CustomSelect
                label={requiredLabel("Giới tính")}
                value={formData.gender}
                onChange={(val) => setFormData((prev) => ({ ...prev, gender: val }))}
                options={GENDER_OPTIONS}
                placeholder="Chọn giới tính..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ✅ SỬA 10: DÙNG StyledTextField */}
                <StyledTextField
                  label="Thành phố / Tỉnh"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  icon={<Building size={16} />}
                  placeholder="Hà Nội, Hưng Yên,..."
                />
                {/* ✅ SỬA 10: DÙNG StyledTextField */}
                <StyledTextField
                  label="Quốc gia"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  icon={<Flag size={16} />}
                  placeholder="Việt Nam"
                />
              </div>
              {/* ✅ SỬA 10: DÙNG StyledTextField */}
              <StyledTextField
                label="Địa chỉ chi tiết"
                name="address"
                value={formData.address}
                onChange={handleChange}
                icon={<MapPin size={16} />}
                placeholder="Số nhà, tên đường, phường/xã..."
              />

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                <Button
                  type="submit"
                  leftIcon={<Save size={16} />}
                  isLoading={loading}
                  disabled={loading || !dirty}
                >
                  {loading ? "Đang lưu..." : "Lưu thông tin"}
                </Button>
                {dirty && (
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<X size={16} />}
                    onClick={handleCancel}
                  >
                    Hủy
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Card>

        {/* Email Section (Giữ nguyên) */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-sm text-gray-500">
                  Email dùng để đăng nhập (Không thể thay đổi).
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-800">
                  {formData.email}
                </span>
                <span className="text-green-600 text-sm bg-green-50 px-2 py-1 rounded">
                  Đã xác thực
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* ❌ SỬA 11: XÓA BỎ CARD "PHONE SECTION" */}
        
      </div>
    );
  };

  // (Các hàm render... còn lại giữ nguyên)
  const renderSecurityTab = () => (
    <div className="space-y-10">
      <ChangePassword />
      <Card>
        <div className="p-6 space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2 mb-4 text-red-600">
            Xóa tài khoản
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-red-600">Xóa tài khoản</h4>
              <p className="text-sm text-gray-500">
                Hành động này không thể hoàn tác. Mọi dữ liệu sẽ bị xóa vĩnh viễn.
              </p>
            </div>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              Xóa
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderMainContent = () => {
    if (activeSection === "account-settings") {
      return (
        <>
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Chỉnh sửa hồ sơ cá nhân
            </h1>
          </div>
          <TabsComponent
            tabs={PROFILE_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <div className="mt-8 md:mt-10">{renderContent()}</div>
        </>
      );
    }
    if (activeSection === "notification-settings") {
      return <SettingsPage />;
    }
    return <h1 className="text-2xl font-bold text-gray-700">Chức năng đang phát triển</h1>;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "info": return renderInfoTab();
      case "security": return renderSecurityTab();
      default: return null;
    }
  };

  // ❌ SỬA 12: XÓA BỎ CustomerLayout (gây lỗi trang trắng)
  // Xử lý trạng thái Loading / Lỗi
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] p-6">
        <p className="text-red-600 font-semibold">Đã xảy ra lỗi:</p>
        <p className="text-gray-700">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Thử lại
        </Button>
      </div>
    );
  }

  if (!currentUser || !userData) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Render chính (Giữ nguyên)
  return (
    // ❌ SỬA 12: XÓA BỎ CustomerLayout
    <main className="w-full bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <AccountMenu
              activeSection={activeSection}
              onSelect={setActiveSection}
              userData={userData || formData}
              onAvatarUpload={handleAvatarUpload}
              isUploadingAvatar={isUploadingAvatar}
            />
          </div>
          <div className="col-span-9">
            {renderMainContent()}

            <ToastPortal>
              {toast.show && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                  <Toast message={toast.msg} type={toast.type} />
                </div>
              )}
            </ToastPortal>

            {/* ❌ SỬA 13: XÓA BỎ 'AddPhoneModal' */}
            
          </div>
        </div>
      </div>
    </main>
    // ❌ SỬA 12: XÓA BỎ CustomerLayout
  );
};

export default ProfilePage;