import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";
// [THAY ĐỔI 1] Import Bookmark thay vì Flag
import { Bookmark, Flame, Crown, Clock, TicketPercent } from "lucide-react";
import placeholderImg from "@/assets/images/placeholder.png";

export default function PromotionCard({ promo, onClick, isSaved, onToggleSave }) {
    const isClickable = typeof onClick === 'function';

    // --- 1. CHUẨN HÓA DỮ LIỆU ---
    const minBookingAmount = promo.minBookingAmount !== undefined
        ? promo.minBookingAmount
        : (promo.minOrder || 0);

    const maxDiscountAmount = promo.maxDiscountAmount !== undefined
        ? promo.maxDiscountAmount
        : (promo.maxDiscount || 0);

    const bgImage = promo.bannerUrl || promo.image || placeholderImg;
    const targetRank = promo.minMembershipRank || promo.targetRank || null;

    // --- 2. LOGIC TÍNH TOÁN ---
    const limit = promo.usageLimit || promo.quantity || 0;
    const used = promo.usageCount || promo.used || 0;
    const usagePercent = limit > 0 ? (used / limit) * 100 : 0;

    const isHot =
        promo.code?.toLowerCase().includes("hot") ||
        promo.description?.toLowerCase().includes("hot") ||
        usagePercent > 80;

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

    const getRankConfig = (rank) => {
        if (!rank) return { show: false };
        const r = rank.toUpperCase();
        switch (r) {
            case 'BRONZE': return { label: 'Đồng', className: 'bg-orange-600 text-white', show: true };
            case 'SILVER': return { label: 'Bạc', className: 'bg-slate-500 text-white', show: true };
            case 'GOLD': return { label: 'Vàng', className: 'bg-yellow-500 text-white', show: true };
            case 'DIAMOND': return { label: 'Kim Cương', className: 'bg-blue-600 text-white', show: true };
            default: return { show: false };
        }
    };

    const rankConfig = getRankConfig(targetRank);

    const handleClick = (e) => {
        if (isClickable) {
            e.preventDefault();
            e.stopPropagation();
            onClick(promo);
        }
    };

    // 3. Xử lý click vào nút Save
    const handleSaveClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleSave) {
            onToggleSave(promo.id);
        }
    };

    return (
        <div className="group relative h-full">
            <Card className="p-0 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out h-full border border-gray-100 flex flex-col relative rounded-2xl bg-white">

                {/* --- HEADER IMAGE --- */}
                <div
                    className="w-full h-40 sm:h-48 overflow-hidden relative cursor-pointer"
                    onClick={handleClick}
                >
                    <img
                        src={bgImage}
                        alt={promo.code || "Khuyến mãi"}
                        onError={(e) => {e.target.src = placeholderImg}}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-60 transition-opacity group-hover:opacity-50" />

                    {/* 4. Nút Lưu (Bookmark Icon) */}
                    <button
                        onClick={handleSaveClick}
                        className={`absolute top-3 left-3 z-20 flex items-center justify-center p-2.5 rounded-full
                            transition-all duration-500 ease-out group/save
                            hover:scale-110 active:scale-95 active:duration-150 backdrop-blur-xl
                            ${isSaved
                                ? "bg-blue-600/90 border border-blue-400/50 text-white shadow-[0_8px_20px_rgb(37_99_235_/30%)]" // Đã lưu: Nền xanh
                                : "bg-black/40 border border-white/20 text-white hover:bg-black/60 shadow-[0_4px_12px_rgb(0_0_0_/20%)]" // Chưa lưu: Nền đen trong suốt
                            }`}
                        title={isSaved ? "Bỏ lưu ưu đãi" : "Lưu vào kho"}
                    >
                        {/* [THAY ĐỔI 2] Sử dụng icon Bookmark ở đây */}
                        <Bookmark
                            size={18}
                            strokeWidth={2}
                            fill="currentColor" // Giữ thuộc tính fill để icon được tô màu kín (trắng)
                            className={`transition-all duration-500 ${isSaved ? "scale-105" : "scale-100"}`}
                        />
                        {isSaved && <span className="absolute inset-0 rounded-full bg-blue-400/30 blur-md animate-pulse z-[-1]"></span>}
                    </button>

                    {/* Badge HOT */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
                        {isHot && (
                            <div className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1 animate-pulse">
                                <Flame size={12} fill="currentColor" />
                                HOT
                            </div>
                        )}
                        {/* Badge Rank */}
                        {rankConfig.show && (
                            <div className={`${rankConfig.className} text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1`}>
                                <Crown size={12} fill="currentColor" />
                                {rankConfig.label}
                            </div>
                        )}
                    </div>

                    {/* Mã Code hiển thị trên ảnh */}
                    <div className="absolute bottom-3 left-3 z-10">
                        <div className="bg-white/90 backdrop-blur-md text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/50">
                            <TicketPercent size={14} strokeWidth={2} />
                            {promo.code}
                        </div>
                    </div>
                </div>

                {/* --- BODY CONTENT (Phần dưới giữ nguyên) --- */}
                <div className="p-4 flex flex-col justify-between flex-grow bg-white relative z-10">
                    <div>
                        <h3
                            className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 mb-3 cursor-pointer hover:text-blue-700 transition-colors leading-snug"
                            title={promo.description}
                            onClick={handleClick}
                        >
                            {promo.discountDetail || promo.description || "Ưu đãi đặc biệt"}
                        </h3>

                        <div className="mb-4 space-y-2 bg-gray-50/80 p-3 rounded-xl border border-gray-100/80">
                            {minBookingAmount > 0 ? (
                                <div className="flex items-start gap-2 text-xs">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 ring-2 ring-blue-100"></span>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 font-medium">Đơn tối thiểu:</span>
                                        <span className="font-bold text-gray-800 text-sm">
                                            {formatCurrency(minBookingAmount)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 ring-2 ring-green-100"></span>
                                    <span>Áp dụng mọi đơn hàng</span>
                                </div>
                            )}

                            {maxDiscountAmount > 0 && (
                                <div className="flex items-start gap-2 text-xs border-t border-gray-200/60 pt-2 mt-2">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 ring-2 ring-orange-100"></span>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 font-medium">Giảm tối đa:</span>
                                        <span className="font-bold text-gray-800 text-sm">
                                            {formatCurrency(maxDiscountAmount)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-auto">
                        {limit > 0 && (
                            <div className="mb-3">
                                <div className="flex justify-between text-[11px] text-gray-500 font-medium mb-1.5 px-0.5">
                                    <span>Đã dùng: {used}</span>
                                    <span>{Math.round(usagePercent)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden relative">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ease-out relative ${usagePercent > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}
                                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                    >
                                         <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12 -translate-x-full"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium bg-gray-100/80 px-2.5 py-1.5 rounded-full">
                                <Clock size={13} className="text-gray-500" />
                                <span>HSD: {promo.endDate ? new Date(promo.endDate).toLocaleDateString('vi-VN') : 'Vô thời hạn'}</span>
                            </div>

                            {isClickable ? (
                                <Button
                                    size="sm"
                                    className="h-9 px-4 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transition-all rounded-full"
                                    onClick={handleClick}
                                >
                                    Sử dụng ngay
                                </Button>
                            ) : (
                                <Link to={`/promotions/${promo.promotionId || promo.id}`}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-9 px-4 text-xs font-semibold border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all rounded-full"
                                    >
                                        Chi tiết
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(150%) skewX(-12deg); }
                }
            `}</style>
        </div>
    );
}