// src/pages/Customer/Profile/AccountMenu.jsx (ĐÃ DỌN DẸP CUỐI CÙNG)

import React from 'react';
import { NavLink } from 'react-router-dom';
// ✅ Chỉ import các icons cần thiết và sử dụng chúng làm components
import { CreditCard, Receipt, DollarSign, Mail, Settings, Power, MapPin } from 'lucide-react';
import Card from "@/components/common/Card/Card";

// ✅ Cấu trúc Menu Widget Cấp 2 ĐÃ DỌN DẸP THEO YÊU CẦU
const MENU_WIDGET_ITEMS = [
    // 1. Nhóm Đặt chỗ/Giao dịch
    { name: "Đặt chỗ của tôi", icon: MapPin, path: "my-bookings", type: "nav" },
    { name: "Danh sách giao dịch", icon: Receipt, path: "transactions", type: "nav" },
    { name: "Refunds", icon: DollarSign, path: "refunds", type: "nav" },

    // 2. Mục Cài đặt/Thông báo (ĐÃ ĐỔI TÊN THÀNH CÀI ĐẶT)
    { name: "Cài đặt", icon: Mail, path: "notification-settings", type: "nav" },

    // 3. Mục Cài đặt Tài khoản (Mục chính của chúng ta)
    { name: "Tài khoản", icon: Settings, path: "account-settings", type: "main" },
];

export default function AccountMenu({ activeSection, onSelect, userData }) {

    // Đảm bảo fullName không bị lỗi khi chưa load
    const profileName = userData?.fullName || "Khách hàng";
    const initials = profileName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const handleLogout = () => {
        alert("Đã đăng xuất!");
        // Xử lý logic đăng xuất thực tế
    };

    return (
        <Card className="h-full p-0">
            <div className="flex flex-col h-full divide-y divide-gray-100">
                {/* 1. Header Avatar (Đã dọn dẹp) */}
                <div className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
                            {initials}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{profileName}</p>
                            {/* ❌ XÓA CHỮ GOOGLE */}
                        </div>
                    </div>
                    {/* ❌ XÓA KHỐI BRONZE PRIORITY */}
                </div>

                {/* 2. Menu Items */}
                <nav className="flex-grow divide-y divide-gray-100">
                    {MENU_WIDGET_ITEMS.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => onSelect(item.path)} // ✅ CHỈ TRUYỀN PATH NGẮN
                            className={`flex items-center w-full p-4 text-left transition duration-150 text-sm 
                                ${activeSection === item.path
                                ? 'bg-[rgb(40,169,224)] text-white font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                            }
                                ${item.type === 'data' ? 'border-b-0' : ''}
                            `}
                        >
                            {/* ✅ Render Icon Component với props chính xác */}
                            <item.icon size={20} className="mr-3" />
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>

                {/* 3. Footer Logout */}
                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center w-full p-2 text-left rounded-lg transition duration-150 text-red-500 hover:bg-red-50">
                        <Power size={20} className="mr-3" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>
        </Card>
    );
}