// src/pages/Owner/Rooms/components/roomData.jsx
import React from "react";
import { Tv, Wind, Droplet, Coffee, Wifi, Ban, BedDouble, Bath } from "lucide-react";

// Danh sách tiện nghi CỦA PHÒNG (Giữ nguyên)
export const ROOM_AMENITIES_LIST = [
  { id: "tv", label: "TV màn hình phẳng", icon: <Tv size={20} /> },
  { id: "ac", label: "Điều hòa", icon: <Wind size={20} /> },
  { id: "minibar", label: "Quầy bar mini", icon: <Droplet size={20} /> },
  { id: "tea_coffee", label: "Trà/Cà phê", icon: <Coffee size={20} /> },
  { id: "wifi", label: "Wi-Fi miễn phí", icon: <Wifi size={20} /> },
  { id: "bathtub", label: "Bồn tắm", icon: <Bath size={20} /> },
  { id: "balcony", label: "Ban công/Sân hiên", icon: <BedDouble size={20} /> },
  { id: "non_smoking", label: "Phòng không hút thuốc", icon: <Ban size={20} /> },
];

// ✅ SỬA LỖI 1: Bỏ Tiếng Anh
export const ROOM_STATUS_OPTIONS = [
  { label: "Sẵn sàng", value: "AVAILABLE" },
  { label: "Đang dọn dẹp", value: "CLEANING" },
  { label: "Đang có khách", value: "OCCUPIED" },
  { label: "Bảo trì", value: "OUT_OF_ORDER" },
];