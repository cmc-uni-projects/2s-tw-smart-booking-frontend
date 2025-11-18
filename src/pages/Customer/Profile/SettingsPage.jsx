import React, { useState } from 'react';
import NotificationSettings from "./NotificationSettings";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";

export default function SettingsPage() {
  const [settings, setSettings] = useState({ notifications: true });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "info" });

  const handleSettingChange = (name, value) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const showToastAndDismiss = (msg, type = "info", duration = 3000) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), duration);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    showToastAndDismiss("Cài đặt đã được lưu thành công!", "success");
  };

  return (
    <div className="flex flex-col w-full p-6 space-y-6">
      <h2 className="text-xl font-semibold">Cài đặt</h2>

      {/* Thông báo qua Email */}
      <Card className="p-4">
        <h4 className="font-medium mb-2">Thông báo qua Email</h4>
        <NotificationSettings
          value={settings.notifications}
          onChange={(val) => handleSettingChange('notifications', val)}
        />
      </Card>

      {/* Ngôn ngữ giao diện */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Ngôn ngữ giao diện</span>
          <LanguageSwitcher navLinkClass="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50" />
        </div>
      </Card>


      {/* Nút lưu */}
      <Button
        onClick={handleSaveSettings}
        isLoading={loading}
        className="mt-2 self-start"
      >
        {loading ? "Đang lưu..." : "Lưu cài đặt"}
      </Button>

      {/* Toast thông báo giống tài khoản */}
      <ToastPortal>
        {toast.show && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
            <Toast message={toast.msg} type={toast.type} />
          </div>
        )}
      </ToastPortal>
    </div>
  );
}
