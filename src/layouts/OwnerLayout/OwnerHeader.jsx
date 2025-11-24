import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, ChevronDown, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/common/Avatar/Avatar";
import OwnerProfileDropdown from "./OwnerProfileDropdown";
import OwnerNotificationDropdown from "./OwnerNotificationDropdown";

const OwnerHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentUser } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const profileRef = useRef(null);
  const notifyRef = useRef(null);

  /** 🔥 Click outside — đóng cả 2 dropdown */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setNotifyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-11">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-50 block lg:hidden rounded-lg border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50 text-gray-600"
          >
            <Menu size={22} />
          </button>

          {/* Search Box */}
          <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh..."
              className="w-72 bg-gray-100/50 hover:bg-white focus:bg-white border border-transparent focus:border-blue-400 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-50 transition-all placeholder-gray-400"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 2xsm:gap-6">

          {/* 🔔 Notification Bell */}
          <div className="relative" ref={notifyRef}>
            <button
              onClick={() => setNotifyOpen(!notifyOpen)}
              className={`relative group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 focus:outline-none shadow-sm
                ${notifyOpen
                  ? "bg-gradient-to-br from-[rgb(40,169,224)] to-[#006494] text-white scale-105"
                  : "bg-white text-blue-600 border border-blue-100 hover:bg-gradient-to-br hover:from-[rgb(40,169,224)] hover:to-[#006494] hover:text-white"
                }
              `}
            >
              {/* 🔴 Notification Badge */}
              <span
                className={`
                  absolute top-[6px] right-[7px] h-2.5 w-2.5 rounded-full border-2 z-10 transition-colors duration-300
                  ${notifyOpen
                    ? "bg-red-400 border-blue-500"
                    : "bg-red-500 border-white group-hover:bg-red-300 group-hover:border-blue-400"
                  }
                `}
              ></span>

              {/* Icon */}
              <Bell size={20} className={`${notifyOpen ? "scale-110" : ""} transition-transform group-hover:rotate-12`} />
            </button>

            {/* Dropdown */}
            {notifyOpen && <OwnerNotificationDropdown />}
          </div>

          {/* Divider */}
          <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-200
                ${profileOpen
                  ? "bg-blue-50 border-blue-100"
                  : "bg-white border-transparent hover:border-gray-200 hover:bg-gray-50"
                }
              `}
            >
              <Avatar
                src={currentUser?.profilePhotoUrl}
                name={currentUser?.fullName}
                size={36}
                className="shadow-sm"
              />

              <div className="hidden lg:block text-left mr-1">
                <span className="block text-sm font-semibold text-gray-700 max-w-[120px] truncate leading-tight">
                  {currentUser?.fullName || "Chủ sở hữu"}
                </span>
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180 text-blue-500" : ""}`}
              />
            </button>

            {profileOpen && <OwnerProfileDropdown onClose={() => setProfileOpen(false)} />}
          </div>

        </div>
      </div>
    </header>
  );
};

export default OwnerHeader;

