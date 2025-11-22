import React, { useState, useMemo, useEffect, useRef } from "react";
import Table from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import PromotionFormModal from "./components/PromotionFormModal";
import {
    Plus, Edit, Trash2, Tag, Search,
    Copy, CheckCircle2, AlertCircle, Ticket, Coins,
    ChevronLeft, ChevronRight, MoreVertical, PauseCircle, PlayCircle, XCircle,
    AlertTriangle, Clock
} from "lucide-react";

// --- COMPONENT CON: MODAL XÁC NHẬN TRẠNG THÁI ---
const StatusConfirmModal = ({ isOpen, onClose, onConfirm, promo }) => {
    if (!isOpen || !promo) return null;

    const willPause = promo.isActive;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-slideUp">
                <div className="p-6 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${willPause ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {willPause ? <AlertTriangle size={32} /> : <CheckCircle2 size={32} />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {willPause ? "Tạm dừng khuyến mãi?" : "Kích hoạt khuyến mãi?"}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                        Bạn có chắc muốn {willPause ? <span className="text-orange-600 font-bold">tạm dừng</span> : <span className="text-green-600 font-bold">kích hoạt</span>} mã
                        <span className="font-bold text-gray-800 mx-1">{promo.code}</span> không?
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors w-1/2">Hủy bỏ</button>
                        <button onClick={onConfirm} className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow-lg transition-transform active:scale-95 w-1/2 flex items-center justify-center gap-2 ${willPause ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-green-500 hover:bg-green-600 shadow-green-200'}`}>
                            {willPause ? <PauseCircle size={18}/> : <PlayCircle size={18}/>}
                            {willPause ? "Tạm dừng" : "Kích hoạt"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- HELPER: Action Menu ---
const ActionMenu = ({ promo, onEdit, onDelete, onRequestToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isExpired = new Date(promo.endDate) < new Date();
    const isPaused = !promo.isActive;

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><MoreVertical size={18} /></button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                    <div className="py-1">
                        <button onClick={() => { onEdit(promo); setIsOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit size={16} className="text-blue-500"/> Sửa</button>
                        {!isExpired && (
                            <button onClick={() => { onRequestToggle(promo); setIsOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                {isPaused ? <><PlayCircle size={16} className="text-green-500"/> Kích hoạt</> : <><PauseCircle size={16} className="text-orange-500"/> Tạm dừng</>}
                            </button>
                        )}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button onClick={() => { onDelete(promo.id); setIsOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={16} /> Xóa</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STAT CARD ---
const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-transform hover:scale-105">
        <div><p className="text-gray-500 text-sm font-medium">{title}</p><h4 className="text-2xl font-bold text-gray-800 mt-1">{value}</h4></div>
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}><Icon size={24} /></div>
    </div>
);

const PromotionManager = () => {
    const getDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };

    const [promotions, setPromotions] = useState([
        { id: 1, code: "SUMMER2025", name: "Hè rực rỡ 2025", type: "PERCENT", value: 20, quantity: 1000, usedCount: 150, minOrder: 500000, maxDiscount: 200000, startDate: getDate(-10), endDate: getDate(60), isActive: true },
        { id: 2, code: "WELCOME_NEW", name: "Chào thành viên mới", type: "FIXED", value: 50000, quantity: 5000, usedCount: 200, minOrder: 0, maxDiscount: 50000, startDate: getDate(-30), endDate: getDate(365), isActive: true },
        { id: 3, code: "APP_ONLY", name: "Ưu đãi đặt trên App", type: "PERCENT", value: 10, quantity: 2000, usedCount: 450, minOrder: 200000, maxDiscount: 50000, startDate: getDate(-5), endDate: getDate(90), isActive: true },
        { id: 4, code: "WEEKEND_FUN", name: "Cuối tuần vui vẻ", type: "PERCENT", value: 15, quantity: 500, usedCount: 20, minOrder: 300000, maxDiscount: 100000, startDate: getDate(0), endDate: getDate(30), isActive: true },
        { id: 5, code: "NIGHT_OWL", name: "Cú đêm săn sale", type: "FIXED", value: 30000, quantity: 300, usedCount: 10, minOrder: 150000, maxDiscount: 30000, startDate: getDate(-2), endDate: getDate(15), isActive: true },
        { id: 6, code: "FLASH_SALE", name: "Flash Sale Giờ Vàng", type: "PERCENT", value: 50, quantity: 100, usedCount: 92, minOrder: 0, maxDiscount: 50000, startDate: getDate(-1), endDate: getDate(2), isActive: true },
        { id: 7, code: "LIMITED_VIP", name: "Đặc quyền VIP", type: "FIXED", value: 500000, quantity: 50, usedCount: 45, minOrder: 2000000, maxDiscount: 500000, startDate: getDate(-5), endDate: getDate(10), isActive: true },
        { id: 8, code: "HOT_DEAL", name: "Deal sốc tháng 11", type: "PERCENT", value: 40, quantity: 200, usedCount: 150, minOrder: 100000, maxDiscount: 200000, startDate: getDate(-3), endDate: getDate(5), isActive: true },
        { id: 9, code: "LAST_CHANCE", name: "Cơ hội cuối cùng", type: "FIXED", value: 100000, quantity: 20, usedCount: 18, minOrder: 0, maxDiscount: 100000, startDate: getDate(-1), endDate: getDate(1), isActive: true },
        { id: 10, code: "CLEARANCE", name: "Xả kho vé máy bay", type: "PERCENT", value: 30, quantity: 1000, usedCount: 980, minOrder: 0, maxDiscount: 500000, startDate: getDate(-10), endDate: getDate(5), isActive: true },
        { id: 11, code: "EXPIRING_SOON_1", name: "Khuyến mãi sắp hết 1", type: "PERCENT", value: 10, quantity: 1000, usedCount: 100, minOrder: 0, maxDiscount: 50000, startDate: getDate(-20), endDate: getDate(1), isActive: true },
        { id: 12, code: "EXPIRING_SOON_3", name: "Khuyến mãi sắp hết 3", type: "FIXED", value: 20000, quantity: 500, usedCount: 200, minOrder: 0, maxDiscount: 20000, startDate: getDate(-10), endDate: getDate(3), isActive: true },
        { id: 13, code: "EXPIRING_SOON_7", name: "Khuyến mãi sắp hết 7", type: "PERCENT", value: 15, quantity: 1000, usedCount: 500, minOrder: 0, maxDiscount: 100000, startDate: getDate(-15), endDate: getDate(6), isActive: true },
        { id: 14, code: "URGENT_SALE", name: "Gấp! Chỉ còn hôm nay", type: "PERCENT", value: 60, quantity: 50, usedCount: 10, minOrder: 0, maxDiscount: 200000, startDate: getDate(0), endDate: getDate(0), isActive: true },
        { id: 15, code: "PAUSED_PROMO", name: "Khuyến mãi tạm ngưng", type: "PERCENT", value: 25, quantity: 100, usedCount: 20, minOrder: 0, maxDiscount: 100000, startDate: getDate(-5), endDate: getDate(20), isActive: false },
        { id: 16, code: "HOLD_ON", name: "Chờ duyệt lại", type: "FIXED", value: 50000, quantity: 200, usedCount: 0, minOrder: 500000, maxDiscount: 50000, startDate: getDate(10), endDate: getDate(30), isActive: false },
        { id: 17, code: "SYSTEM_MAINTENANCE", name: "Bảo trì hệ thống", type: "PERCENT", value: 5, quantity: 10000, usedCount: 500, minOrder: 0, maxDiscount: 10000, startDate: getDate(-100), endDate: getDate(100), isActive: false },
        { id: 18, code: "PAST_SUMMER", name: "Hè năm ngoái", type: "PERCENT", value: 50, quantity: 100, usedCount: 100, minOrder: 0, maxDiscount: 200000, startDate: getDate(-400), endDate: getDate(-365), isActive: true },
        { id: 19, code: "YESTERDAY_GONE", name: "Vừa hết hôm qua", type: "FIXED", value: 100000, quantity: 50, usedCount: 49, minOrder: 0, maxDiscount: 100000, startDate: getDate(-5), endDate: getDate(-1), isActive: true },
        { id: 20, code: "OLD_TET", name: "Tết 2024", type: "FIXED", value: 88000, quantity: 88, usedCount: 88, minOrder: 0, maxDiscount: 88000, startDate: getDate(-365), endDate: getDate(-360), isActive: false },
        { id: 21, code: "TEST_PAGINATION_1", name: "Mã test phân trang 1", type: "PERCENT", value: 10, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 22, code: "TEST_PAGINATION_2", name: "Mã test phân trang 2", type: "PERCENT", value: 10, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 23, code: "TEST_PAGINATION_3", name: "Mã test phân trang 3", type: "PERCENT", value: 10, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 24, code: "TEST_PAGINATION_4", name: "Mã test phân trang 4", type: "PERCENT", value: 10, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 25, code: "TEST_PAGINATION_5", name: "Mã test phân trang 5", type: "PERCENT", value: 10, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 26, code: "TEST_PAGINATION_6", name: "Mã test phân trang 6", type: "PERCENT", value: 10, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 27, code: "TEST_PAGINATION_7", name: "Mã test phân trang 7", type: "PERCENT", value: 10, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 28, code: "TEST_PAGINATION_8", name: "Mã test phân trang 8", type: "PERCENT", value: 10, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 29, code: "TEST_PAGINATION_9", name: "Mã test phân trang 9", type: "PERCENT", value: 10, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 30, code: "TEST_PAGINATION_10", name: "Mã test phân trang 10", type: "PERCENT", value: 10, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 31, code: "TEST_PAGINATION_11", name: "Mã test phân trang 11", type: "FIXED", value: 10000, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 32, code: "TEST_PAGINATION_12", name: "Mã test phân trang 12", type: "FIXED", value: 10000, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 33, code: "TEST_PAGINATION_13", name: "Mã test phân trang 13", type: "FIXED", value: 10000, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 34, code: "TEST_PAGINATION_14", name: "Mã test phân trang 14", type: "FIXED", value: 10000, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
        { id: 35, code: "TEST_PAGINATION_15", name: "Mã test phân trang 15", type: "FIXED", value: 10000, quantity: 100, usedCount: 10, minOrder: 0, maxDiscount: 10000, startDate: getDate(10), endDate: getDate(20), isActive: true },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterType, setFilterType] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState("");
    const itemsPerPage = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const [statusConfirm, setStatusConfirm] = useState({ isOpen: false, promo: null });

    const getPromoStatus = (promo) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(promo.endDate);
        if (endDate < today) return "EXPIRED";
        if (!promo.isActive) return "PAUSED";
        return "ACTIVE";
    };

    const filteredPromotions = useMemo(() => {
        return promotions.filter(item => {
            const matchesSearch = item.code.toLowerCase().includes(searchTerm.toLowerCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const status = getPromoStatus(item);
            const matchesStatus = filterStatus === "ALL" || filterStatus === status;
            const matchesType = filterType === "ALL" || item.type === filterType;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [promotions, searchTerm, filterStatus, filterType]);

    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPromotions.slice(start, start + itemsPerPage);
    }, [filteredPromotions, currentPage]);

    useMemo(() => setCurrentPage(1), [searchTerm, filterStatus, filterType]);

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

    const stats = {
        total: promotions.length,
        active: promotions.filter(p => getPromoStatus(p) === 'ACTIVE').length,
        inactive: promotions.filter(p => getPromoStatus(p) === 'PAUSED').length,
    };

    const columns = [
        { key: "codeDisplay", label: "Mã Code" },
        { key: "name", label: "Tên chương trình" },
        { key: "details", label: "Chi tiết giảm" },
        { key: "usageProgress", label: "Lượt sử dụng" },
        { key: "endDate", label: "Hết hạn" },
        { key: "statusLabel", label: "Trạng thái" },
        { key: "actions", label: "Hành động" },
    ];

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert(`Đã copy: ${text}`);
    };

    const handleRequestToggleStatus = (promo) => setStatusConfirm({ isOpen: true, promo });

    const handleConfirmToggleStatus = () => {
        if (statusConfirm.promo) {
            setPromotions(prev => prev.map(item => item.id === statusConfirm.promo.id ? { ...item, isActive: !item.isActive } : item));
            setStatusConfirm({ isOpen: false, promo: null });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getDaysRemaining = (dateString) => {
        const today = new Date();
        today.setHours(0,0,0,0);
        const end = new Date(dateString);
        const diffTime = end - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getDisplayData = (data) => {
        return data.map(item => {
            const status = getPromoStatus(item);
            const daysRemaining = getDaysRemaining(item.endDate);
            const usagePercent = Math.round((item.usedCount / item.quantity) * 100);
            const isNearFull = usagePercent >= 90;

            return {
                ...item,
                codeDisplay: (
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleCopy(item.code)} title="Click để copy">
            <span className={`font-mono font-bold px-2 py-1 rounded border transition-colors ${status === 'ACTIVE' ? 'text-[rgb(40,169,224)] bg-blue-50 border-blue-100 group-hover:bg-blue-100' : (status === 'PAUSED' ? 'text-orange-600 bg-orange-50 border-orange-100 group-hover:bg-orange-100' : 'text-gray-500 bg-gray-100 border-gray-200')}`}>
              {item.code}
            </span>
                        <Copy size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                ),
                details: item.type === 'PERCENT' ? `${item.value}% (Tối đa ${Number(item.maxDiscount).toLocaleString()}đ)` : `${Number(item.value).toLocaleString()}đ`,

                usageProgress: (
                    <div className="w-32">
                        <div className="flex justify-between text-xs mb-1 font-medium">
                            <span className={`${isNearFull ? 'text-red-600' : 'text-gray-700'}`}>{item.usedCount}</span>
                            <span className="text-gray-400">/ {item.quantity}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${isNearFull ? 'bg-red-500' : (usagePercent > 50 ? 'bg-orange-400' : 'bg-[rgb(40,169,224)]')}`}
                                style={{ width: `${usagePercent}%` }}
                            ></div>
                        </div>
                    </div>
                ),

                endDate: (
                    <div className="flex flex-col">
                        <span className="text-gray-600 whitespace-nowrap font-medium">{formatDate(item.endDate)}</span>
                        {status === 'ACTIVE' && daysRemaining > 0 && daysRemaining <= 7 && (
                            <span className="text-[10px] text-orange-500 flex items-center gap-1 font-medium mt-0.5">
                        <Clock size={10} /> Sắp hết hạn
                    </span>
                        )}
                    </div>
                ),

                statusLabel: (
                    <>
                        {status === 'ACTIVE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Hoạt động</span>}
                        {status === 'PAUSED' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Tạm dừng</span>}
                        {status === 'EXPIRED' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"><XCircle size={12} /> Hết hạn</span>}
                    </>
                ),

                // ✅ CĂN GIỮA ICON 3 CHẤM
                actions: (
                    <div className="flex justify-center">
                        <ActionMenu
                            promo={item}
                            onEdit={(p) => { setEditingPromo(p); setIsModalOpen(true); }}
                            onDelete={handleDelete}
                            onRequestToggle={handleRequestToggleStatus}
                        />
                    </div>
                )
            };
        });
    };

    const handleSave = (data) => {
        if (editingPromo) {
            setPromotions(prev => prev.map(item => item.id === editingPromo.id ? { ...data, id: item.id, usedCount: item.usedCount } : item));
        } else {
            const newId = Date.now();
            setPromotions(prev => [{ ...data, id: newId, usedCount: 0 }, ...prev]);
            setCurrentPage(1);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa mã này không?")) {
            setPromotions(prev => prev.filter(item => item.id !== id));
        }
    };

    const selectClassName = "px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all";

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Tag className="text-[rgb(40,169,224)]" /> Quản lý Khuyến mãi
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Tạo và quản lý các mã giảm giá, voucher cho khách hàng.</p>
                </div>
                <Button onClick={() => { setEditingPromo(null); setIsModalOpen(true); }} leftIcon={<Plus size={18} />}>
                    Thêm mã mới
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Tổng mã khuyến mãi" value={stats.total} icon={Ticket} bgClass="bg-blue-50" colorClass="text-blue-600" />
                <StatCard title="Đang hoạt động" value={stats.active} icon={CheckCircle2} bgClass="bg-green-50" colorClass="text-green-600" />
                <StatCard title="Đã tạm dừng" value={stats.inactive} icon={AlertCircle} bgClass="bg-orange-50" colorClass="text-orange-600" />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text" placeholder="Tìm kiếm theo mã code hoặc tên..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-2 md:pb-0">
                    <select className={selectClassName} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="PAUSED">Tạm dừng</option>
                        <option value="EXPIRED">Đã hết hạn</option>
                    </select>
                    <select className={selectClassName} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="ALL">Tất cả loại giảm</option>
                        <option value="PERCENT">Giảm theo %</option>
                        <option value="FIXED">Giảm tiền mặt</option>
                    </select>
                    {(searchTerm || filterStatus !== 'ALL' || filterType !== 'ALL') && (
                        <button onClick={() => { setSearchTerm(""); setFilterStatus("ALL"); setFilterType("ALL"); }} className="px-4 py-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-medium whitespace-nowrap">Xóa lọc</button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[500px] [&_th:last-child]:hidden [&_td:last-child]:hidden">
                {filteredPromotions.length > 0 ? (
                    <>
                        <Table columns={columns} data={getDisplayData(paginatedData)} />
                        <div className="mt-auto border-t border-gray-100">
                            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-gray-50/50 gap-4">
                                <span className="text-sm text-gray-500">Hiển thị <span className="font-semibold text-gray-700">{paginatedData.length}</span> / <span className="font-semibold text-gray-700">{filteredPromotions.length}</span> kết quả</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"><ChevronLeft size={18} /></button>
                                    <div className="flex gap-1">
                                        {getPaginationGroup().map((item, index) => (
                                            <button key={index} onClick={() => typeof item === 'number' && setCurrentPage(item)} disabled={item === '...'} className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${item === currentPage ? 'bg-[rgb(40,169,224)] text-white shadow-sm' : item === '...' ? 'bg-transparent text-gray-400 cursor-default' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{item}</button>
                                        ))}
                                    </div>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"><ChevronRight size={18} /></button>
                                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                                        <span className="text-sm text-gray-500 whitespace-nowrap">Đi đến:</span>
                                        <div className="relative">
                                            <input type="text" className="w-12 h-8 pl-2 pr-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:border-[rgb(40,169,224)] focus:ring-1 focus:ring-[rgb(40,169,224)] transition-all" placeholder={currentPage} value={jumpPage} onChange={(e) => { const val = e.target.value; if (val === '' || /^[0-9]+$/.test(val)) setJumpPage(val); }} onKeyDown={handleJumpPage} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Search size={40} className="text-gray-300" /></div>
                        <h3 className="text-lg font-semibold text-gray-800">Không tìm thấy kết quả</h3>
                        <button onClick={() => { setSearchTerm(""); setFilterStatus("ALL"); setFilterType("ALL"); }} className="mt-4 text-blue-600 font-medium hover:underline">Xóa bộ lọc & tìm lại</button>
                    </div>
                )}
            </div>

            <PromotionFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSave} initialData={editingPromo} />
            <StatusConfirmModal isOpen={statusConfirm.isOpen} onClose={() => setStatusConfirm({ isOpen: false, promo: null })} onConfirm={handleConfirmToggleStatus} promo={statusConfirm.promo} />
        </div>
    );
};

export default PromotionManager;