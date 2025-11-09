// src/pages/Customer/Profile/NotificationSettings.jsx
import React from "react";
import Card from "@/components/common/Card/Card";

const NotificationSettings = ({ value, onChange }) => {
    return (
        <Card className="mb-6">
            <div className="p-6 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">Thông báo</h3>
                    <p className="text-gray-600 text-sm">
                        Bật hoặc tắt thông báo cho tài khoản của bạn
                    </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                    {/* Nền switch */}
                    <div
                        className={`w-11 h-6 rounded-full transition-colors
              ${value ? "bg-blue-600" : "bg-gray-200"}`}
                    ></div>
                    {/* Nút tròn luôn trắng */}
                    <div
                        className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transform transition-transform
              ${value ? "translate-x-5" : "translate-x-0"}`}
                    ></div>
                </label>
            </div>
        </Card>
    );
};

export default NotificationSettings;
