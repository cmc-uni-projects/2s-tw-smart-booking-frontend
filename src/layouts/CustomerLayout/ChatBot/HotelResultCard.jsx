// src/layouts/CustomerLayout/ChatBot/HotelResultCard.jsx
import React from "react";

const HotelResultCard = ({ data }) => {
    if (!data || !data.properties) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">
                🔍 Kết quả tìm phòng tại <span className="font-bold">{data.city}</span>
            </h3>

            {data.properties.map((hotel) => (
                <div
                    key={hotel.propertyId}
                    className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
                >
                    <div className="flex flex-col">
                        {/* Tên khách sạn */}
                        <div className="font-semibold text-gray-800 text-sm">
                            {hotel.name}
                        </div>

                        {/* Địa chỉ */}
                        <div className="text-xs text-gray-500 mb-2">
                            📍 {hotel.address}
                        </div>

                        {/* Rating & Review */}
                        <div className="text-xs text-gray-600 mb-2">
                            ⭐ {hotel.rating} ({hotel.reviewCount} đánh giá)
                        </div>

                        {/* LIST ROOM */}
                        <div className="space-y-2">
                            {hotel.rooms.map((room, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg p-2 bg-gray-50 flex flex-col"
                                >
                                    <div className="text-sm font-medium">{room.roomName}</div>
                                    <div className="text-xs text-gray-600">
                                        👥 {room.capacity} khách
                                    </div>
                                    <div className="text-xs text-gray-700">
                                        💰 {room.price.toLocaleString()}đ / đêm
                                    </div>

                                    {/* BUTTON ĐI ĐẾN TRANG BOOKING */}
                                    <a
                                        href={room.bookingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-md text-center"
                                    >
                                        Đặt phòng
                                    </a>
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
