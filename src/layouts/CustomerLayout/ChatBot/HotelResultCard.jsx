// src/layouts/CustomerLayout/ChatBot/HotelResultCard.jsx
import React from "react";
import { MapPin, Star, Users, Banknote, Search, ExternalLink, Building2 } from "lucide-react";

const HotelResultCard = ({ data }) => {
    if (!data || !data.properties) return null;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Search size={18} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-700">
                    Kết quả tìm kiếm tại <span className="font-bold text-gray-900">{data.city}</span>
                </h3>
            </div>

            {/* Danh sách khách sạn */}
            {data.properties.map((hotel) => (
                <div
                    key={hotel.propertyId}
                    className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex flex-col gap-2">
                        {/* Header Khách sạn: Icon + Tên */}
                        <div className="flex items-start gap-2.5">
                            <div className="p-1.5 bg-blue-50 rounded-lg shrink-0">
                                <Building2 size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-800 text-sm leading-tight">
                                    {hotel.name}
                                </div>
                                {/* Địa chỉ */}
                                <div className="flex items-start gap-1 mt-1">
                                    <MapPin size={12} className="text-red-500 shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-500 line-clamp-1">
                                        {hotel.address}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 ml-[38px]">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="font-medium text-gray-900">{hotel.rating}</span>
                            <span className="text-gray-400">({hotel.reviewCount} đánh giá)</span>
                        </div>

                        {/* LIST ROOM */}
                        <div className="space-y-2 mt-2">
                            {hotel.rooms.map((room, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-100 rounded-lg p-2.5 bg-gray-50/50 flex flex-col gap-1.5"
                                >
                                    <div className="text-sm font-semibold text-gray-800">
                                        {room.roomName}
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            {/* Số khách */}
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <Users size={12} className="text-gray-400" />
                                                {room.capacity} khách
                                            </div>
                                            {/* Giá tiền */}
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                                                <Banknote size={12} />
                                                {room.price.toLocaleString()}đ / đêm
                                            </div>
                                        </div>

                                        {/* Nút đặt phòng */}
                                        <a
                                            href={room.bookingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-medium px-3 py-1.5 rounded-full transition-colors"
                                        >
                                            Đặt ngay <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HotelResultCard;