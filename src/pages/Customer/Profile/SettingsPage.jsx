// src/pages/Customer/Profile/SettingsPage.jsx (ĐÃ FIX LỖI TRANG TRẮNG VÀ BỐ CỤC 2 CỘT)

import React, { useState } from 'react';
// Imports các files con
import NotificationSettings from "./NotificationSettings";
import LanguageSettings from "./LanguageSettings";
import AccountMenu from "./AccountMenu"; // ✅ IMPORT MENU WIDGET
import Select from "@/components/common/Select/Select";


// ✅ IMPORT CHUNG BẰNG ALIAS
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import { Save, Globe } from 'lucide-react';

// Dữ liệu Options Ngôn ngữ đơn giản
const LANGUAGE_OPTIONS = [
    { label: "Tiếng Việt", value: "vi" },
    { label: "Tiếng Anh", value: "en" },
];

// Giả lập dữ liệu người dùng cần thiết cho AccountMenu
const MOCK_USER_DATA = {
    fullName: "Nguyễn Văn A",
};


export default function SettingsPage() {
    // Dữ liệu cài đặt giả lập ban đầu
    const [settings, setSettings] = useState({
        notifications: true,
        language: "Tiếng Việt",
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: "", type: "info" });

    // ✅ STATE QUẢN LÝ MENU WIDGET (Để giữ mục Cài đặt được chọn)
    const [activeSection, setActiveSection] = useState('notification-settings');

    // Hàm xử lý chung cho thay đổi cài đặt
    const handleSettingChange = (name, value) => { setSettings(prev => ({ ...prev, [name]: value })); };

    // Hàm hiển thị và tự đóng Toast
    const showToastAndDismiss = (msg, type = "info", duration = 3000) => {
        setToast({ show: true, msg, type });
        setTimeout(() => { setToast(prev => ({ ...prev, show: false })); }, duration);
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        // Mô phỏng API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        showToastAndDismiss("Cài đặt đã được lưu thành công!", "success");
    };

    // HÀM RENDER NỘI DUNG FORM CHÍNH CỦA TRANG CÀI ĐẶT
    const renderSettingsContent = () => (
        <div className="space-y-10">
            <h3 className="text-xl font-bold text-gray-800">Cài đặt Chung</h3>

            {/* 1. KHỐI CÀI ĐẶT THÔNG BÁO */}
            <NotificationSettings
                value={settings.notifications}
                onChange={(val) => handleSettingChange('notifications', val)}
            />

            {/* 2. KHỐI CÀI ĐẶT NGÔN NGỮ */}
            <Card>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Globe size={20} className="text-[rgb(40,169,224)]" />
                        <h3 className="font-semibold text-lg">Ngôn ngữ giao diện</h3>
                    </div>

                    <div className="w-60">
                        <Select
                            value={settings.language}
                            onChange={(label) => handleSettingChange('language', label)}
                            options={LANGUAGE_OPTIONS}
                        />
                    </div>
                </div>
            </Card>

            {/* Nút Lưu */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSaveSettings}
                    isLoading={loading}
                    leftIcon={<Save size={16} />}
                >
                    {loading ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
            </div>

            {/* Toast Portal */}
            <ToastPortal>
                {toast.show && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                        <Toast message={toast.msg} type={toast.type} />
                    </div>
                )}
            </ToastPortal>
        </div>
    );


    return (
        // ✅ BỐ CỤC 2 CỘT TỰ XỬ LÝ (GIỐNG ProfilePage.jsx)
        <div className="grid grid-cols-12 gap-8 p-8">

            {/* 1. CỘT MENU WIDGET (3/12) */}
            <div className="col-span-3">
                <AccountMenu
                    activeSection={activeSection}
                    onSelect={setActiveSection}
                    userData={MOCK_USER_DATA}
                />
            </div>

            {/* 2. CỘT NỘI DUNG CHÍNH (9/12) */}
            <div className="col-span-9">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Cài đặt</h1>

                {/* ❌ Trang trắng xảy ra vì không có logic chuyển đổi ở đây */}
                {/* Tạm thời chỉ render nội dung Cài đặt Chung */}
                {renderSettingsContent()}
            </div>
        </div>
    );
}