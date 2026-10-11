import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/common/Button/Button";
import RoomRow from "./RoomRow";

const FilterChip = ({ children }) => (
    <Button
        variant="outline"
        size="sm"
        className="bg-white hover:bg-gray-50 border-gray-200 text-gray-600 font-medium !rounded-full text-xs px-3 py-1"
    >
        {children}
    </Button>
);

// ✅ Nhận thêm prop onBookNow từ cha
const RoomListSection = ({ rooms, onRoomInfoClick, onBookNow }) => {
    const { t } = useTranslation("hotel");
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Filter Bar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="font-bold text-gray-800 text-lg">
                    {t("rooms.available", { count: rooms.length })}
                </div>
                <div className="flex gap-2">
                    <FilterChip>{t("rooms.chipSuggested")}</FilterChip>
                    <FilterChip>{t("rooms.chipLowest")}</FilterChip>
                </div>
            </div>

            {/* Table Header (Desktop) - Layout 12 Cột */}
            <div className="hidden lg:grid grid-cols-12 gap-6 px-6 py-4 border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-7">{t("rooms.colInfo")}</div>
                <div className="col-span-2 text-center">{t("rooms.colCapacity")}</div>
                <div className="col-span-3 text-right">{t("rooms.colPrice")}</div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
                {rooms.map((room) => (
                    <RoomRow 
                        key={room.id} 
                        room={room} 
                        onInfoClick={onRoomInfoClick} 
                        onBookNow={onBookNow} // ✅ Truyền tiếp xuống RoomRow
                    />
                ))}
            </div>
        </div>
    );
};


export default RoomListSection;