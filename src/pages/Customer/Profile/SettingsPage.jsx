import React, { useState, useEffect } from "react";
import AccountMenu from "@/pages/Customer/Profile/AccountMenu";
import { 
    Bell, Globe, Shield, 
    Check, ChevronRight 
} from "lucide-react";
import ToggleSwitch from "@/components/common/Input/ToggleSwitch";
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";

// ✅ 1. Import thêm Auth & Service
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";

const SettingsPage = () => {
    // ✅ 2. Lấy currentUser từ Context
    const { currentUser, updateUser } = useAuth();
    
    // State lưu data user mới nhất
    const [userInfo, setUserInfo] = useState(currentUser);
    
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
    
    // State cho upload avatar (để AccountMenu hoạt động full chức năng)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // Mock Data cho Settings
    const [settings, setSettings] = useState({
        emailNoti: true,
        smsNoti: false,
        deviceNoti: true,
        twoFactor: false
    });

    const showToastAndDismiss = (msg, type = "info") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    // ✅ 3. Fetch dữ liệu mới nhất khi vào trang
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await userService.getUserDetail();
                if(data) setUserInfo(data);
            } catch (error) {
                console.error("Lỗi lấy thông tin:", error);
            }
        };
        fetchUser();
    }, []);

    // ✅ 4. Hàm xử lý Upload Avatar (Copy từ ProfilePage/MembershipPage)
    const handleAvatarUpload = async (file) => {
        setIsUploadingAvatar(true);
        try {
            const res = await userService.uploadAvatar(file);
            if (res.success && res.data) {
                const newUrl = res.data.profilePhotoUrl;
                setUserInfo(prev => ({ ...prev, profilePhotoUrl: newUrl }));
                updateUser({ profilePhotoUrl: newUrl }); // Đồng bộ Context
                showToastAndDismiss("Cập nhật ảnh đại diện thành công!", "success");
            }
        } catch (err) {
            console.error("Upload failed:", err);
            showToastAndDismiss("Lỗi khi tải ảnh lên.", "error");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showToastAndDismiss("Đã lưu cài đặt thành công!", "success");
        }, 800);
    };

    return (
        <main className="w-full bg-gray-50 text-gray-800">
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-12 gap-8">
                    
                    {/* CỘT TRÁI: MENU */}
                    <div className="col-span-12 lg:col-span-3">
                        {/* ✅ 5. Truyền props vào AccountMenu */}
                        <AccountMenu 
                            userData={userInfo} 
                            onAvatarUpload={handleAvatarUpload}
                            isUploadingAvatar={isUploadingAvatar}
                        /> 
                    </div>

                    {/* CỘT PHẢI: NỘI DUNG CÀI ĐẶT */}
                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        
                        {/* Header */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Cài đặt tài khoản</h1>
                                <p className="text-gray-500 text-sm mt-1">Quản lý thông báo và tuỳ chọn ứng dụng</p>
                            </div>
                            <Button onClick={handleSave} isLoading={loading} className="px-6">
                                Lưu thay đổi
                            </Button>
                        </div>

                        {/* 1. Cài đặt Thông báo */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
                                <Bell size={20} className="text-blue-500" /> Cài đặt thông báo
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-700">Thông báo qua Email</p>
                                        <p className="text-xs text-gray-500">Nhận cập nhật về đơn đặt phòng và khuyến mãi</p>
                                    </div>
                                    <ToggleSwitch 
                                        checked={settings.emailNoti} 
                                        onChange={() => handleToggle("emailNoti")} 
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-700">Tin nhắn SMS</p>
                                        <p className="text-xs text-gray-500">Nhận mã OTP và thông báo khẩn cấp</p>
                                    </div>
                                    <ToggleSwitch 
                                        checked={settings.smsNoti} 
                                        onChange={() => handleToggle("smsNoti")} 
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-700">Thông báo đẩy (Push Notification)</p>
                                        <p className="text-xs text-gray-500">Thông báo trực tiếp trên trình duyệt/ứng dụng</p>
                                    </div>
                                    <ToggleSwitch 
                                        checked={settings.deviceNoti} 
                                        onChange={() => handleToggle("deviceNoti")} 
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* 2. Ngôn ngữ & Giao diện */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
                                <Globe size={20} className="text-green-500" /> Ngôn ngữ & Khu vực
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-xl cursor-pointer hover:border-blue-500 transition-all bg-blue-50/50 border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🇻🇳</span>
                                            <div>
                                                <p className="font-bold text-gray-800">Tiếng Việt</p>
                                                <p className="text-xs text-gray-500">Ngôn ngữ mặc định</p>
                                            </div>
                                        </div>
                                        <Check size={18} className="text-blue-600" />
                                    </div>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-xl cursor-not-allowed opacity-60 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🇺🇸</span>
                                            <div>
                                                <p className="font-bold text-gray-800">English</p>
                                                <p className="text-xs text-gray-500">Coming soon</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* 3. Bảo mật khác */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
                                <Shield size={20} className="text-red-500" /> Bảo mật nâng cao
                            </h3>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-700">Xác thực 2 yếu tố (2FA)</p>
                                    <p className="text-xs text-gray-500">Tăng cường bảo mật khi đăng nhập</p>
                                </div>
                                <ToggleSwitch 
                                    checked={settings.twoFactor} 
                                    onChange={() => handleToggle("twoFactor")} 
                                />
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center cursor-pointer group">
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                    Xem lịch sử đăng nhập
                                </span>
                                <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600" />
                            </div>
                        </Card>

                    </div>
                </div>
            </div>

            <ToastPortal>
                {toast.show && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                        <Toast message={toast.msg} type={toast.type} />
                    </div>
                )}
            </ToastPortal>
        </main>
    );
};

export default SettingsPage;