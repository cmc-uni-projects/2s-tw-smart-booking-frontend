// src/pages/Owner/Rooms/components/roomData.js
import React from "react";
import { Tv, Wind, Droplet, Coffee, Wifi, Ban, BedDouble, Bath } from "lucide-react";

// Danh sách tiện nghi CỦA PHÒNG (khác với tiện nghi CƠ SỞ)
export const ROOM_AMENITIES_LIST = [
  { id: "tv", label: "TV màn hình phẳng", icon: <Tv size={20} /> },
  { id: "ac", label: "Điều hòa", icon: <Wind size={20} /> },
  { id: "minibar", label: "Quầy bar mini", icon: <Droplet size={20} /> },
  { id: "tea_coffee", label: "Trà/Cà phê", icon: <Coffee size={20} /> },
  { id: "wifi", label: "Wi-Fi miễn phí", icon: <Wifi size={20} /> },
  { id: "bathtub", label: "Bồn tắm", icon: <Bath size={20} /> },
  { id: "balcony", label: "Ban công/Sân hiên", icon: <BedDouble size={20} /> }, // (Dùng tạm icon)
  { id: "non_smoking", label: "Phòng không hút thuốc", icon: <Ban size={20} /> },
];

// Danh sách trạng thái phòng (cho dropdown)
export const ROOM_STATUS_OPTIONS = [
  { label: "Sẵn sàng (Available)", value: "AVAILABLE" },
  { label: "Đang dọn dẹp (Cleaning)", value: "CLEANING" },
  { label: "Đang có khách (Occupied)", value: "OCCUPIED" },
  { label: "Bảo trì (Out of Order)", value: "OUT_OF_ORDER" },
];