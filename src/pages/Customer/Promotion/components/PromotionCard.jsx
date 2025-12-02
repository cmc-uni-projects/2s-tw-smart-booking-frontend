import React from "react";
import { Link } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
// 1. Import thêm icon Heart
import { Tag, Flame, Crown, Clock, TicketPercent, Heart } from "lucide-react";
import placeholderImg from "@/assets/images/placeholder.png";

// 2. Nhận thêm props isSaved và onToggleSave
export default function PromotionCard({ promo, onClick, isSaved, onToggleSave }) {
    const isClickable = typeof onClick === 'function';

    // --- 1. CHUẨN HÓA DỮ LIỆU TỪ DTO BACKEND ---
    // Backend trả về: minBookingAmount, maxDiscountAmount, usageLimit, usageCount, bannerUrl

    // Đơn tối thiểu
    const minBookingAmount = promo.minBookingAmount !== undefined
        ? promo.minBookingAmount
        : (promo.minOrder || 0);

    // Giảm tối đa
    const maxDiscountAmount = promo.maxDiscountAmount !== undefined
        ? promo.maxDiscountAmount
        : (promo.maxDiscount || 0);

    // Xử lý ảnh: Ưu tiên bannerUrl từ backend -> image cũ -> placeholder
    const bgImage = promo.bannerUrl || promo.image || placeholderImg;

    // Xử lý Rank (Nếu backend chưa trả về thì mặc định ẩn hoặc hiển thị logic cũ)
    const targetRank = promo.minMembershipRank || promo.targetRank || null;

    // --- 2. LOGIC TÍNH TOÁN ---

    // Tính phần trăm đã sử dụng (Dựa trên usageLimit và usageCount của DTO)
    const limit = promo.usageLimit || promo.quantity || 0;
    const used = promo.usageCount || promo.used || 0;
    const usagePercent = limit > 0 ? (used / limit) * 100 : 0;

    // Logic xác định HOT
    const isHot =
        promo.code?.toLowerCase().includes("hot") || // Check theo mã code
        promo.description?.toLowerCase().includes("hot") ||
        usagePercent > 80;

    // Format tiền tệ chuẩn VN
    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

    // Cấu hình hiển thị Rank
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

    // Xử lý click vào Card
    const handleClick = (e) => {
        if (isClickable) {
            e.preventDefault();
            e.stopPropagation();
            onClick(promo);
        }
    };

    // 3. Xử lý click vào nút Tim (Lưu/Bỏ lưu)
    const handleHeartClick = (e) => {
        e.preventDefault();     // Ngăn chặn chuyển trang/mở modal
        e.stopPropagation();    // Ngăn chặn sự kiện click lan ra card cha
        if (onToggleSave) {
            onToggleSave(promo.id);
        }
    };

    return (
        <div className="group relative h-full">
            <Card className="p-0 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full border border-gray-100 flex flex-col relative rounded-2xl bg-white">

                {/* --- HEADER IMAGE --- */}
                <div
                    className="w-full h-40 sm:h-48 overflow-hidden relative cursor-pointer"
                    onClick={handleClick}
                >
                    <img
                        src={bgImage}
                        alt={promo.code || "Khuyến mãi"}
                        onError={(e) => {e.target.src = placeholderImg}} // Fallback nếu ảnh lỗi
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* 4. Nút Tim (Heart Button) - Mới thêm vào */}
                    <button
                        onClick={handleHeartClick}
                        className="absolute top-3 left-3 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white transition-all group/heart shadow-sm border border-white/10"
                        title={isSaved ? "Bỏ lưu ưu đãi" : "Lưu ưu đãi"}
                    >
                        <Heart
                            size={18}
                            className={`transition-colors duration-300 ${
                                isSaved
                                    ? "fill-red-500 text-red-500" // Trạng thái đã lưu
                                    : "text-white group-hover/heart:text-red-500" // Trạng thái chưa lưu
                            }`}
                        />
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
                        <div className="bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                            <TicketPercent size={14} />
                            {promo.code}
                        </div>
                    </div>
                </div>

                {/* --- BODY CONTENT --- */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                        {/* Tên/Mô tả ngắn */}
                        <h3
                            className="font-bold text-gray-800 text-sm sm:text-base line-clamp-2 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                            title={promo.description}
                            onClick={handleClick}
                        >
                            {/* Ưu tiên hiển thị discountDetail nếu có (ví dụ: Giảm 10% tối đa 50k) hoặc description */}
                            {promo.discountDetail || promo.description || "Ưu đãi đặc biệt"}
                        </h3>

                        {/* --- KHU VỰC THÔNG TIN ĐIỀU KIỆN --- */}
                        <div className="mb-4 space-y-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                            {/* Hiển thị Đơn tối thiểu */}
                            {minBookingAmount > 0 ? (
                                <div className="flex items-start gap-2 text-xs">
                                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500">Đơn tối thiểu:</span>
                                        <span className="font-semibold text-gray-700">
                                            {formatCurrency(minBookingAmount)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs text-green-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                                    <span>Áp dụng mọi đơn hàng</span>
                                </div>
                            )}

                            {/* Hiển thị Giảm tối đa (Chỉ hiện nếu có giá trị > 0) */}
                            {maxDiscountAmount > 0 && (
                                <div className="flex items-start gap-2 text-xs border-t border-gray-200 pt-2">
                                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500">Giảm tối đa:</span>
                                        <span className="font-semibold text-gray-700">
                                            {formatCurrency(maxDiscountAmount)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- FOOTER --- */}
                    <div className="mt-auto">
                        {/* Progress Bar (nếu có giới hạn lượt dùng) */}
                        {limit > 0 && (
                            <div className="mb-3">
                                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                    <span>Đã dùng: {used}</span>
                                    <span>{Math.round(usagePercent)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-500 ${usagePercent > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <div className="pt-3 border-t border-dashed border-gray-200 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                <Clock size={12} />
                                <span>HSD: {promo.endDate ? new Date(promo.endDate).toLocaleDateString('vi-VN') : 'Vô thời hạn'}</span>
                            </div>

                            {/* Nút bấm */}
                            {isClickable ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                    onClick={handleClick}
                                >
                                    Sử dụng ngay
                                </Button>
                            ) : (
                                <Link to={`/promotions/${promo.promotionId || promo.id}`}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-xs hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                    >
                                        Chi tiết
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}