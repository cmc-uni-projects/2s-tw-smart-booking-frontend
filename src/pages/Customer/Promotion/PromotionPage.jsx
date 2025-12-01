import React, { useEffect, useState, useMemo } from "react";
import promotionService from "@/services/promotion.service";
import PromotionList from "./components/PromotionList";
import PromotionDetailModal from "./components/PromotionDetailModal";
import PromotionFilter from "./components/PromotionFilter";
// Import Banner mới tạo
import AutoScrollBanner from "./components/AutoScrollBanner";
import { Tag, ChevronLeft, ChevronRight } from "lucide-react";

// Config URL ảnh
const BE_BASE_URL = "http://localhost:8386";
const UPLOAD_DIR = "/uploads/";
const getFullImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BE_BASE_URL}${UPLOAD_DIR}${cleanPath}`;
};

const PromotionPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. State tìm kiếm & Phân trang
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState("");
    const itemsPerPage = 9;

    // Gọi API
    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await promotionService.getAllPromotions();
                // Kiểm tra cấu trúc dữ liệu trả về để lấy mảng chuẩn
                const rawData = Array.isArray(response) ? response : (response.data || []);

                const now = new Date();
                const activePromotions = rawData.filter(p => {
                    const endDate = new Date(p.endDate);
                    return p.status === "ACTIVE" && endDate > now;
                });

                // Sắp xếp ID giảm dần để cái mới nhất lên đầu
                activePromotions.sort((a, b) => b.promotionId - a.promotionId);

                // --- QUAN TRỌNG: Mapping dữ liệu từ API sang format Frontend ---
                const mappedPromotions = activePromotions.map(p => {
                    const cleanDiscountValue = Number(p.discountValue || 0);
                    const cleanMinOrder = Number(p.minBookingAmount || 0);
                    const cleanMaxDiscount = Number(p.maxDiscountAmount || 0);

                    return {
                        id: p.promotionId,
                        title: p.description, // Hoặc p.name nếu API có trường name

                        // Format chuỗi mô tả dùng số liệu đã làm sạch
                        description: `Giảm ${p.discountType === 'PERCENTAGE' ? cleanDiscountValue + '%' : cleanDiscountValue.toLocaleString('vi-VN') + 'đ'} cho đơn từ ${cleanMinOrder.toLocaleString('vi-VN')}đ`,

                        // Hàm getFullImageUrl đảm bảo Banner nhận đúng đường dẫn ảnh
                        image: getFullImageUrl(p.bannerUrl),

                        code: p.code,
                        endDate: p.endDate,
                        startDate: p.startDate,

                        minOrder: cleanMinOrder,
                        minBookingAmount: cleanMinOrder,

                        maxDiscount: cleanMaxDiscount,
                        maxDiscountAmount: cleanMaxDiscount,

                        discountType: p.discountType,
                        discountValue: cleanDiscountValue,

                        used: p.usageCount || 0,
                        quantity: p.usageLimit || 100,

                        targetRank: p.minMembershipRank || p.targetRank || null
                    };
                });

                setPromotions(mappedPromotions);
            } catch (error) {
                console.error("Failed to fetch promotions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, []);

    // 2. Logic Filter (Tìm kiếm)
    const filteredPromotions = useMemo(() => {
        return promotions.filter(promo => {
            const term = searchTerm.toLowerCase();
            return (
                promo.title?.toLowerCase().includes(term) ||
                promo.code?.toLowerCase().includes(term) ||
                promo.description?.toLowerCase().includes(term)
            );
        });
    }, [promotions, searchTerm]);

    // Reset về trang 1 khi search thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // 3. Logic Pagination (Phân trang)
    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPromotions.slice(start, start + itemsPerPage);
    }, [filteredPromotions, currentPage]);

    // Helper: Tạo mảng trang (vd: 1 ... 4 5 6 ... 10)
    const getPaginationGroup = () => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }
        range.forEach(i => {
            if (l) {
                if (i - l === 2) rangeWithDots.push(l + 1);
                else if (i - l !== 1) rangeWithDots.push('...');
            }
            rangeWithDots.push(i);
            l = i;
        });
        return rangeWithDots;
    };

    const handleJumpPage = (e) => {
        if (e.key === 'Enter') {
            const page = parseInt(jumpPage);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                setCurrentPage(page);
                setJumpPage("");
            }
        }
    };

    // Hàm xử lý mở modal (sẽ được truyền xuống Banner và List)
    const handleOpenPromo = (promo) => {
        setSelectedPromo(promo);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPromo(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* 1. Header Trang */}
                <div className="bg-gradient-to-r from-[rgb(40,169,224)] to-[rgb(26,140,189)] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Tag className="w-8 h-8" /> Kho Ưu Đãi & Khuyến Mãi
                        </h1>
                        <p className="mt-2 text-blue-100 max-w-2xl">
                            Săn ngay hàng ngàn mã giảm giá độc quyền dành cho khách hàng thân thiết.
                        </p>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                </div>

                {/* 2. Banner Tự Động Chạy */}
                {!loading && promotions.length > 0 && (
                    <div className="w-full">
                        <AutoScrollBanner
                            promotions={promotions}
                            onBannerClick={handleOpenPromo} // <--- ĐÃ CẬP NHẬT: Truyền hàm mở modal vào đây
                        />
                    </div>
                )}

                {/* 3. Phần Content chính (Filter + List) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px] flex flex-col">

                    {/* Filter Bar */}
                    <PromotionFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        totalCount={filteredPromotions.length}
                    />

                    {/* Danh sách Khuyến mãi */}
                    <div className="flex-1">
                        <PromotionList
                            promotions={paginatedData}
                            loading={loading}
                            onViewDetail={handleOpenPromo}
                        />
                    </div>

                    {/* Pagination Controls */}
                    {filteredPromotions.length > 0 && !loading && (
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                                <span className="text-sm text-gray-500">
                                    Hiển thị <span className="font-semibold text-gray-700">{paginatedData.length}</span> / <span className="font-semibold text-gray-700">{filteredPromotions.length}</span> kết quả
                                </span>

                                <div className="flex items-center gap-2">
                                    {/* Nút Prev */}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    {/* Số trang */}
                                    <div className="flex gap-1">
                                        {getPaginationGroup().map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => typeof item === 'number' && setCurrentPage(item)}
                                                disabled={item === '...'}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                                                    item === currentPage
                                                        ? 'bg-[rgb(40,169,224)] text-white shadow-sm'
                                                        : item === '...'
                                                            ? 'bg-transparent text-gray-400 cursor-default'
                                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Nút Next */}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        <ChevronRight size={18} />
                                    </button>

                                    {/* Go to page input */}
                                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 hidden sm:flex">
                                        <span className="text-sm text-gray-500 whitespace-nowrap">Đi đến:</span>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-12 h-8 pl-2 pr-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:border-[rgb(40,169,224)] focus:ring-1 focus:ring-[rgb(40,169,224)] transition-all"
                                                placeholder={currentPage}
                                                value={jumpPage}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '' || /^[0-9]+$/.test(val)) setJumpPage(val);
                                                }}
                                                onKeyDown={handleJumpPage}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Chi tiết */}
            <PromotionDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                promo={selectedPromo}
            />
        </div>
    );
};

export default PromotionPage;