// src/pages/Customer/Booking/components/PromotionSelectionModal.jsx

import React, { useEffect, useState, useRef } from 'react';
import Spinner from '@/components/common/Loading/Spinner';
import promotionService from "@/services/promotion.service";
import { TicketPercent, Calendar, CheckCircle2, ChevronDown } from 'lucide-react';
import Button from '@/components/common/Button/Button';

// Đường dẫn Public Path (Đã được sửa lỗi import)
const TRAVEL_MATE_LOGO_PUBLIC_PATH = "/assets/logo_promption/1.jpg";
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150x100?text=No+Image";
    if (path.startsWith("http")) return path;
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (!cleanPath.startsWith('/uploads')) cleanPath = `/uploads${cleanPath}`;
    return `${BASE_URL}${cleanPath}`;
};

// ====================================================================
// CON COMPONENT 1: RENDER MỘT MÃ KHUYẾN MÃI TRONG DANH SÁCH (ĐÃ CẬP NHẬT KÍCH THƯỚC)
// ====================================================================
const PromotionListItem = ({ promo, isSelected, accentColor, onSelect }) => {
    const isSystemPromo = !promo.ownerId; // Mã Admin/Hệ thống
    const isOwner = promo.ownerId;
    const discountText = promo.discountType === 'PERCENTAGE'
        ? `${promo.discountValue}%`
        : `${promo.discountValue?.toLocaleString()}₫`;

    const maxDiscountText = promo.maxDiscountAmount > 0
        ? ` (Tối đa ${promo.maxDiscountAmount.toLocaleString()}₫)`
        : '';

    // LOGIC: Nếu là mã hệ thống, dùng PUBLIC PATH. Ngược lại, dùng URL BE.
    const imageUrl = isSystemPromo
        ? TRAVEL_MATE_LOGO_PUBLIC_PATH
        : getFullImageUrl(promo.bannerUrl);

    return (
        <li
            className={`group relative cursor-pointer select-none py-2 pl-3 pr-9 transition-colors border-l-4 border-transparent hover:bg-gray-50 ${
                isSelected ? `${isOwner ? 'bg-purple-50 border-purple-500 hover:bg-purple-100' : 'bg-blue-50 border-blue-500 hover:bg-blue-100'}` : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelect(promo)}
        >
            <div className="flex items-center gap-3">
                {/* Logo/Image đại diện (KÍCH THƯỚC MỚI: w-20 h-16) */}
                <div className="w-20 h-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 bg-white shadow-sm">
                    <img
                        src={imageUrl}
                        alt={promo.code}
                        className={`w-full h-full ${isSystemPromo ? 'object-contain p-1' : 'object-cover'}`}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/48x40?text=Voucher"; }}
                    />
                </div>

                {/* Nội dung chi tiết */}
                <div className="flex flex-col min-w-0 flex-1">
                    <span className={`font-semibold block truncate text-sm ${isSelected ? accentColor : 'text-gray-900'}`}>
                        {promo.code}
                    </span>
                    <p className="text-gray-500 text-xs truncate">
                        Giảm {discountText} {maxDiscountText}
                    </p>
                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar size={10} /> HSD: {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                    </span>
                </div>
            </div>

            {/* Icon Check nếu đang chọn */}
            {isSelected && (
                <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${accentColor}`}>
                    <CheckCircle2 size={16} />
                </span>
            )}
        </li>
    );
};

// ====================================================================
// CON COMPONENT 2: OPTION KHÔNG DÙNG MÃ (Giữ nguyên)
// ====================================================================
const NoPromotionOption = ({ isSelected, accentColor, onSelect }) => (
    <li
        className="group relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100 border-l-4 border-transparent"
        onClick={() => onSelect(null)}
    >
        <div className="flex items-center">
            <span className={`font-normal block truncate text-gray-500 italic ${isSelected ? 'font-medium' : ''}`}>
                Không dùng mã khuyến mãi
            </span>
        </div>
        {isSelected && (
            <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${accentColor}`}>
                <CheckCircle2 size={16} />
            </span>
        )}
    </li>
);

// ====================================================================
// MAIN COMPONENT: DROPDOWN (Giữ nguyên)
// ====================================================================
const PromotionSelectionDropdown = ({ isOpen, onClose, onSelect, selectedId, filterType, bookingOwnerId }) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    const isOwner = filterType === 'OWNER';
    const accentColor = isOwner ? 'text-purple-600' : 'text-blue-600';
    const title = isOwner ? "Ưu đãi từ Khách sạn" : "Ưu đãi từ TravelMate";

    useEffect(() => {
        if (isOpen) {
            fetchPromotions();
        }
    }, [isOpen, filterType, bookingOwnerId]);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const response = await promotionService.getAllPromotions();
            const rawData = Array.isArray(response) ? response : (response.data || []);
            const now = new Date();
            let activePromotions = rawData.filter(p => p.status === "ACTIVE" && new Date(p.endDate) > now);

            if (filterType === 'ADMIN') {
                activePromotions = activePromotions.filter(p => !p.ownerId);
            } else if (filterType === 'OWNER') {
                activePromotions = bookingOwnerId
                    ? activePromotions.filter(p => p.ownerId === bookingOwnerId)
                    : [];
            }
            setPromotions(activePromotions);
        } catch (error) {
            console.error("Lỗi tải khuyến mãi:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="absolute z-50 mt-1 left-0 right-0 max-h-64 w-full overflow-y-auto rounded-xl bg-white text-base shadow-2xl ring-1 ring-black/10 focus:outline-none sm:text-sm transform transition-opacity duration-200"
        >
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-4 border-b border-gray-100 z-10">
                <h4 className={`font-bold text-lg ${accentColor}`}>{title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">Vui lòng chọn mã áp dụng.</p>
            </div>

            <div className="py-1">
                {loading ? (
                    <div className="flex justify-center py-4"><Spinner size="sm" /></div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {/* Option Không dùng mã */}
                        <NoPromotionOption
                            isSelected={!selectedId}
                            accentColor={accentColor}
                            onSelect={onSelect}
                        />

                        {/* Danh sách mã */}
                        {promotions.length > 0 ? promotions.map((promo) => (
                            <PromotionListItem
                                key={promo.promotionId}
                                promo={promo}
                                isSelected={selectedId === promo.promotionId}
                                accentColor={accentColor}
                                onSelect={onSelect}
                            />
                        )) : (
                            <div className="text-center py-4 text-gray-500 flex flex-col items-center gap-1 text-sm px-4">
                                <TicketPercent size={20} className="text-gray-300" />
                                <p>Không có mã nào khả dụng.</p>
                            </div>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default PromotionSelectionDropdown;