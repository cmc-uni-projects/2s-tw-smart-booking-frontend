import React from 'react';
import { NavLink } from 'react-router-dom';
import { Receipt, DollarSign, Settings, MapPin, User } from 'lucide-react';
import Card from "@/components/common/Card/Card";

const MENU_WIDGET_ITEMS = [
  { name: "Đặt chỗ của tôi", icon: MapPin, path: "my-bookings", type: "nav" },
  { name: "Danh sách giao dịch", icon: Receipt, path: "transactions", type: "nav" },
  { name: "Refunds", icon: DollarSign, path: "refunds", type: "nav" },
  { name: "Cài đặt", icon: Settings, path: "notification-settings", type: "nav" },
  { name: "Tài khoản", icon: User, path: "account-settings", type: "main" },
];

export default function AccountMenu({ activeSection, onSelect, userData }) {
  const profileName = userData?.fullName || "Khách hàng";
  const initials = profileName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Card className="h-full p-0">
      <div className="flex flex-col h-full divide-y divide-gray-100">
        {/* Header Avatar */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
              {initials}
            </div>
            <div>
              <p className="font-medium text-gray-800">{profileName}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-grow divide-y divide-gray-100">
          {MENU_WIDGET_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => onSelect(item.path)}
              className={`flex items-center w-full p-4 text-left transition duration-150 text-sm
                ${activeSection === item.path
                  ? 'bg-[rgb(40,169,224)] text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <item.icon size={20} className="mr-3" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </Card>
  );
}