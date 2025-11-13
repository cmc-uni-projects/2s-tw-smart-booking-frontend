import React, { useState } from 'react';
import { Receipt, DollarSign, Settings, MapPin, User } from 'lucide-react';
import Card from "@/components/common/Card/Card";
import AvatarUpload from "@/components/common/Input/AvatarUpload"; 
import AvatarUploadModal from "./AvatarUploadModal"; // ✅ Import Modal mới

const MENU_WIDGET_ITEMS = [
    { name: "Đặt chỗ của tôi", icon: MapPin, path: "my-bookings", type: "nav" },
    { name: "Danh sách giao dịch", icon: Receipt, path: "transactions", type: "nav" },
    { name: "Refunds", icon: DollarSign, path: "refunds", type: "nav" },
    { name: "Cài đặt", icon: Settings, path: "notification-settings", type: "nav" },
    { name: "Tài khoản", icon: User, path: "account-settings", type: "main" },
];

export default function AccountMenu({ 
    activeSection, 
    onSelect, 
    userData, 
    onAvatarUpload, // Hàm gọi API từ ProfilePage
    isUploadingAvatar 
}) {
    const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý Modal

    const profileName = userData?.fullName || "Khách hàng";
    const profileImage = userData?.profilePhotoUrl || null;

    // Hàm trung gian: Nhận file từ Modal -> Gửi lên ProfilePage -> Đóng Modal
    const handleSaveAvatar = async (file) => {
        await onAvatarUpload(file);
        setIsModalOpen(false);
    };

    return (
        <>
            <Card className="h-full p-0">
                <div className="flex flex-col h-full">
                    
                    {/* Header: Avatar & Tên */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            {/* ✅ AvatarUpload giờ chỉ để kích hoạt mở Modal */}
                            <div className="flex-shrink-0">
                                <AvatarUpload 
                                    src={profileImage} 
                                    name={profileName} 
                                    size={50} 
                                    onClick={() => setIsModalOpen(true)} // Mở Modal khi click
                                    isLoading={isUploadingAvatar}
                                />
                            </div>
                            
                            <div className="overflow-hidden flex-1">
                                <p className="font-semibold text-gray-800 truncate" title={profileName}>
                                    {profileName}
                                </p>
                                {userData?.email && (
                                    <p className="text-xs text-gray-500 truncate" title={userData.email}>
                                        {userData.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-grow p-2 space-y-1">
                        {MENU_WIDGET_ITEMS.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => onSelect(item.path)}
                                className={`flex items-center w-full p-3 text-left transition-all duration-200 rounded-lg
                                    ${activeSection === item.path
                                        ? 'bg-[rgb(40,169,224)] text-white font-medium shadow-sm'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                                `}
                            >
                                <item.icon 
                                    size={20} 
                                    className={`mr-3 ${activeSection === item.path ? 'text-white' : 'text-gray-500'}`} 
                                />
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </Card>

            {/* ✅ Component Modal nằm ở đây */}
            <AvatarUploadModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAvatar}
                isLoading={isUploadingAvatar}
            />
        </>
    );
}