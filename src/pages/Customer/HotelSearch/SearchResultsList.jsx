// src/pages/Customer/HotelSearch/SearchResultsList.jsx
import React from "react";
import Spinner from "@/components/common/Loading/Spinner";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HotelListCard from "@/components/common/Card/HotelListCard";

// --- Component Hiển Thị Kết Quả (Đã tách file) ---
export default function SearchResultsList({ loading, hotels }) {
    if (loading) {
        return (
            <div className="py-24 flex justify-center">
                <Spinner />
            </div>
        );
    }
    if (hotels.length === 0) {
        return (
            <div className="py-20">
                <EmptyState
                    title="Không tìm thấy khách sạn"
                    description="Vui lòng thử tìm kiếm với thông tin khác."
                />
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-6">
            {hotels.map((h) => (
                <HotelListCard key={h.id} hotel={h} />
            ))}
        </div>
    );
}