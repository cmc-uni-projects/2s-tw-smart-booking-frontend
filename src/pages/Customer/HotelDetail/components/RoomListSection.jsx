import React from "react";
import Button from "@/components/common/Button/Button";
import RoomRow from "./RoomRow";

const FilterChip = ({ children }) => (
    <Button
        variant="outline"
        size="sm"
        className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 font-medium !rounded-lg"
    >
        {children}
    </Button>
);

const RoomListSection = ({ rooms, onRoomInfoClick }) => {
    return (
        <div className="p-0">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100 bg-gray-50/50">
                <FilterChip>Gói Khách Sạn ({rooms.length})</FilterChip>
                <FilterChip>Xác nhận ngay</FilterChip>
                <FilterChip>Thanh toán trước</FilterChip>
            </div>

            {/* Table Header (Desktop) */}
            <div className="hidden lg:grid grid-cols-10 gap-4 px-6 py-3 border-b border-gray-200 bg-white">
                <div className="col-span-4 font-semibold text-sm text-gray-600 uppercase">Chi tiết phòng</div>
                <div className="col-span-2 font-semibold text-sm text-gray-600 uppercase text-center">Tóm tắt</div>
                <div className="col-span-1 font-semibold text-sm text-gray-600 uppercase text-center">Sức chứa</div>
                <div className="col-span-3 font-semibold text-sm text-gray-600 uppercase text-right">Giá hôm nay</div>
            </div>

            {/* List */}
            <div className="space-y-4 p-4 lg:p-6 bg-gray-50">
                {rooms.map((room) => (
                    <RoomRow key={room.id} room={room} onInfoClick={onRoomInfoClick} />
                ))}
            </div>
        </div>
    );
};

export default RoomListSection;