import React from "react";
import { Search, Bell } from "lucide-react";
import SearchInput from "../../components/common/Input/SearchInput"; // Goal 2
import Avatar from "../../components/common/Avatar/Avatar"; // Goal 2
import { useAuth } from "../../context/AuthContext";

const AdminHeader = () => {
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search */}
        <div className="w-full max-w-md">
          <SearchInput placeholder="Tìm kiếm user, booking..." />
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-[rgb(40,169,224)]">
            <Bell size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <Avatar 
              name={currentUser?.fullName || "Admin"} 
              size={36} 
            />
            <div className="text-sm">
              <div className="font-semibold text-gray-800">
                {currentUser?.fullName}
              </div>
              <div className="text-gray-500">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;