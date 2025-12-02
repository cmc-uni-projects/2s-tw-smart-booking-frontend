import React, { useEffect, useState, useMemo } from "react";
// 1. Thêm useLocation để nhận state từ trang Home chuyển sang
import { useLocation } from "react-router-dom";
import promotionService from "@/services/promotion.service";
import PromotionList from "./components/PromotionList";
import PromotionDetailModal from "./components/PromotionDetailModal";
import PromotionFilter from "./components/PromotionFilter";
// Import Banner
import AutoScrollBanner from "./components/AutoScrollBanner";
// Import TabsComponent
import TabsComponent from "@/components/common/Tabs/TabsComponent";
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
    const location = useLocation(); // Hook lấy state từ trang Home
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- LOGIC MỚI: QUẢN LÝ TAB & DANH SÁCH ĐÃ LƯU ---
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'saved'
    const [savedIds, setSavedIds] = useState([]);

    // Load danh sách đã lưu từ localStorage khi component mount
    useEffect(() => {
        const saved = localStorage.getItem('savedPromotions');
        if (saved) {
            try {
                setSavedIds(JSON.parse(saved));
            } catch (e) {
                console.error("Lỗi đọc savedPromotions từ localStorage", e);
            }
        }
    }, []);

    // Hàm xử lý khi người dùng bấm tim (Lưu/Bỏ lưu)
    // Hàm này cũng được truyền vào Modal để lưu khi bấm Copy
    const handleToggleSave = (id) => {
        setSavedIds(prev => {
            const newSaved = prev.includes(id)
                ? prev.filter(item => item !== id) // Nếu có rồi thì xoá
                : [...prev, id]; // Nếu chưa có thì thêm

            // Lưu lại vào localStorage
            localStorage.setItem('savedPromotions', JSON.stringify(newSaved));
            return newSaved;
        });
    };

    // Cấu hình Tabs
    const tabs = [
        { id: 'all', name: 'Tất cả ưu đãi' },
        { id: 'saved', name: 'Kho ưu đãi của tôi' }
    ];

    // 1. State tìm kiếm & Phân trang
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState("");
    const itemsPerPage = 9;

    // Gọi API lấy danh sách khuyến mãi
    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await promotionService.getAllPromotions();
                const rawData = Array.isArray(response) ? response : (response.data || []);

                const now = new Date();
                const activePromotions = rawData.filter(p => {
                    const endDate = new Date(p.endDate);
                    return p.status === "ACTIVE" && endDate > now;
                });

                // Sắp xếp ID giảm dần
                activePromotions.sort((a, b) => b.promotionId - a.promotionId);

                // Mapping dữ liệu
                const mappedPromotions = activePromotions.map(p => {
                    const cleanDiscountValue = Number(p.discountValue || 0);
                    const cleanMinOrder = Number(p.minBookingAmount || 0);
                    const cleanMaxDiscount = Number(p.maxDiscountAmount || 0);

                    return {
                        id: p.promotionId,
                        title: p.description,
                        description: `Giảm ${p.discountType === 'PERCENTAGE' ? cleanDiscountValue + '%' : cleanDiscountValue.toLocaleString('vi-VN') + 'đ'} cho đơn từ ${cleanMinOrder.toLocaleString('vi-VN')}đ`,
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

                // 3. --- LOGIC MỚI: TỰ ĐỘNG MỞ MODAL KHI CÓ ID TỪ TRANG HOME ---
                if (location.state?.targetPromoId) {
                    const targetId = location.state.targetPromoId;
                    const foundPromo = mappedPromotions.find(p => p.id === targetId);

                    if (foundPromo) {
                        setSelectedPromo(foundPromo);
                        setIsModalOpen(true);
                        // Xóa state để không mở lại khi F5
                        window.history.replaceState({}, document.title);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch promotions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, [location.state]); // Thêm dependency để chạy lại khi chuyển trang có state

    // 2. Logic Filter (Tìm kiếm & Tab)
    // Bước 1: Lọc nguồn dữ liệu dựa trên Tab
    const sourcePromotions = useMemo(() => {
        if (activeTab === 'saved') {
            return promotions.filter(p => savedIds.includes(p.id));
        }
        return promotions;
    }, [activeTab, promotions, savedIds]);

    // Bước 2: Lọc theo từ khóa tìm kiếm
    const filteredPromotions = useMemo(() => {
        return sourcePromotions.filter(promo => {
            const term = searchTerm.toLowerCase();
            return (
                promo.title?.toLowerCase().includes(term) ||
                promo.code?.toLowerCase().includes(term) ||
                promo.description?.toLowerCase().includes(term)
            );
        });
    }, [sourcePromotions, searchTerm]);

    // Reset trang về 1 khi search hoặc đổi tab
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab]);

    // 3. Logic Pagination (Phân trang)
    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPromotions.slice(start, start + itemsPerPage);
    }, [filteredPromotions, currentPage]);

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
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                </div>

                {/* 2. Banner Tự Động Chạy (Chỉ hiện ở Tab Tất cả) */}
                {!loading && activeTab === 'all' && promotions.length > 0 && (
                    <div className="w-full">
                        <AutoScrollBanner
                            promotions={promotions}
                            onBannerClick={handleOpenPromo}
                        />
                    </div>
                )}

                {/* 3. Phần Content chính (Tabs + Filter + List) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px] flex flex-col">

                    {/* --- TABS COMPONENT --- */}
                    <div className="mb-6">
                        <TabsComponent
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>

                    <PromotionFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        totalCount={filteredPromotions.length}
                    />

                    <div className="flex-1 mt-4">
                        <PromotionList
                            promotions={paginatedData}
                            loading={loading}
                            onViewDetail={handleOpenPromo}
                            // Truyền props cho tính năng Save ở danh sách
                            savedIds={savedIds}
                            onToggleSave={handleToggleSave}
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
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

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

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        <ChevronRight size={18} />
                                    </button>

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

            {/* Modal Chi tiết - Đã cập nhật props */}
            <PromotionDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                promo={selectedPromo}
                // [QUAN TRỌNG] Truyền props để Modal có thể gọi hàm lưu
                savedIds={savedIds}
                onToggleSave={handleToggleSave}
            />
        </div>
    );
};

export default PromotionPage;