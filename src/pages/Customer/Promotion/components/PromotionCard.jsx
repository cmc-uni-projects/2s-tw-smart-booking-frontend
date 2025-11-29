import React from "react";
import { Link } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
// Import thêm icon Crown
import { Tag, Flame, Crown } from "lucide-react";

export default function PromotionCard({ promo, onClick }) {
    const isClickable = typeof onClick === 'function';

    // Logic xác định HOT (giữ nguyên)
    const usagePercent = promo.quantity > 0 ? (promo.used / promo.quantity) * 100 : 0;
    const isHot =
        promo.title?.toLowerCase().includes("hot") ||
        promo.isHot === true ||
        usagePercent > 80;

    const handleClick = (e) => {
        if (isClickable) {
            e.preventDefault();
            e.stopPropagation();
            onClick(promo);
        }
    };

    // Cấu hình màu sắc cho Hạng (Style giống HOT badge nhưng khác màu)
    const getRankConfig = (rank) => {
        const r = rank ? rank.toUpperCase() : 'ALL';
        switch (r) {
            case 'BRONZE':
                return {
                    label: 'Đồng',
                    // Màu cam đất (Bronze)
                    className: 'bg-orange-600 text-white',
                    show: true
                };
            case 'SILVER':
                return {
                    label: 'Bạc',
                    // Màu xám (Silver) - Dùng slate-500 cho đậm
                    className: 'bg-slate-500 text-white',
                    show: true
                };
            case 'GOLD':
                return {
                    label: 'Vàng',
                    // Màu vàng (Gold) - Dùng yellow-500
                    className: 'bg-yellow-500 text-white',
                    show: true
                };
            case 'DIAMOND':
                return {
                    label: 'Kim Cương',
                    // Màu xanh (Blue/Cyan) như bạn yêu cầu
                    className: 'bg-blue-600 text-white',
                    show: true
                };
            default:
                return { show: false };
        }
    };

    const rankConfig = getRankConfig(promo.targetRank);

    return (
        <div className="group relative h-full">
            <Card className="p-0 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full border border-gray-100 flex flex-col relative rounded-2xl">

                {/* --- HÌNH ẢNH --- */}
                <div
                    className="w-full h-48 overflow-hidden relative cursor-pointer"
                    onClick={handleClick}
                >
                    <img
                        src={promo.image}
                        alt={promo.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* --- KHU VỰC BADGE (Góc Phải Trên) --- */}
                    {/* Sử dụng flex-row-reverse để xếp từ phải qua trái: HOT -> RANK */}
                    <div className="absolute top-3 right-3 z-10 flex flex-row-reverse items-start gap-2">

                        {/* 1. BADGE HOT (Luôn nằm ngoài cùng bên phải nếu có) */}
                        {isHot && (
                            <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1 animate-pulse">
                                <Flame size={12} fill="currentColor" />
                                HOT
                            </div>
                        )}

                        {/* 2. BADGE HẠNG (Nằm bên cạnh HOT) */}
                        {/* Lấy code style y hệt badge HOT phía trên */}
                        {rankConfig.show && (
                            <div className={`${rankConfig.className} text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1`}>
                                <Crown size={12} fill="currentColor" />
                                {rankConfig.label}
                            </div>
                        )}
                    </div>

                </div>

                {/* --- NỘI DUNG (Giữ nguyên) --- */}
                <div className="p-4 flex flex-col justify-between flex-grow bg-white">
                    <div>
                        <h3
                            className="font-bold text-gray-800 text-base line-clamp-2 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                            title={promo.title}
                            onClick={handleClick}
                        >
                            {promo.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                            {promo.description}
                        </p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-dashed border-gray-100 flex items-center justify-between gap-2">
                        <div className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">
                            HSD: {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                        </div>

                        {isClickable ? (
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs hover:bg-blue-50 text-blue-600 border-blue-200"
                                onClick={handleClick}
                            >
                                Chi tiết
                            </Button>
                        ) : (
                            <Link to={`/promotions/${promo.id}`}>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs hover:bg-blue-50 text-blue-600 border-blue-200"
                                >
                                    Chi tiết
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
