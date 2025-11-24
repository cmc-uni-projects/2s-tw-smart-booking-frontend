// File: OwnerBookingsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
    Users,
    Clock,
    AlertCircle,
    BedDouble,
    RefreshCw,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import Button from "./components/common/Button";
import OccupiedRoomsTable from "./components/bookings/OccupiedRoomsTable"; // Nhớ kiểm tra tên file có 's' hay không
import BookingDetailModal from "./BookingDetailModal";
import CheckOutModal from "./CheckOutModal"; // <--- 1. IMPORT MODAL MỚI

// ... (Giữ nguyên phần MOCK_DATA, ITEMS_PER_PAGE, COLOR_MAP như cũ) ...
// Dữ liệu mẫu để test
const MOCK_DATA = [
    
    {
        id: 101,
        bookingCode: "BK-10111",
        roomName: "Standard Single (P. 101)",
        customerName: "Nguyễn Văn A",
        phone: "0901234567",
        email: "nguyena@gmail.com",
        checkIn: "2025-11-18",
        checkOut: "2025-11-25",
        totalPrice: 3500000,
        guestCount: "1 người",
        paymentMethod: "Tiền mặt",
        status: "Chưa thanh toán",
        specialRequest: "Không"
    },
    {
        id: 102,
        bookingCode: "BK-10222",
        roomName: "Standard Double (P. 102)",
        customerName: "Trần Thị B",
        phone: "0912345678",
        email: "tranb@yahoo.com",
        checkIn: "2025-11-20",
        checkOut: "2025-11-23",
        totalPrice: 4200000,
        guestCount: "2 người",
        paymentMethod: "Ví MoMo",
        status: "Đã cọc 50%",
        specialRequest: "Cần thêm chăn"
    },
   

    // ... các data khác giữ nguyên ...
];
const ITEMS_PER_PAGE = 10;
const COLOR_MAP = {
    blue: { text: "text-blue-600", bg: "bg-blue-50", gradient: "from-blue-50" },
    amber: { text: "text-amber-600", bg: "bg-amber-50", gradient: "from-amber-50" },
    rose: { text: "text-rose-600", bg: "bg-rose-50", gradient: "from-rose-50" }
};

const OwnerBookingsPage = () => {
    // State cơ bản
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("tat-ca");
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState("");

    // State cho Detail Modal
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // --- 2. STATE CHO CHECKOUT MODAL ---
    const [checkOutRoom, setCheckOutRoom] = useState(null); // Lưu phòng đang muốn trả
const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
    const fetchOccupiedRooms = async () => {
        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 600));
            setRooms(MOCK_DATA);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOccupiedRooms();
        setIsCheckOutModalOpen(false); // Đóng modal
        setCheckOutRoom(null);         // Xóa dữ liệu phòng tạm
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword, statusFilter]);

    // --- 3. SỬA HÀM XỬ LÝ NÚT TRẢ PHÒNG (KHI BẤM NÚT TRONG BẢNG HOẶC TRONG DETAIL) ---
    // Hàm này chỉ mở Modal xác nhận lên thôi
    const handleOpenCheckOutModal = (roomId) => {
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            setCheckOutRoom(room);
            setIsCheckOutModalOpen(true);
            // Nếu đang mở modal chi tiết thì đóng nó lại luôn cho gọn (tuỳ chọn)
            setIsDetailModalOpen(false); 
        }
    };

    // --- 4. HÀM THỰC HIỆN TRẢ PHÒNG (KHI BẤM "ĐỒNG Ý" TRONG MODAL) ---
    const handleConfirmCheckOut = () => {
        if (!checkOutRoom) return;
        console.log("Đang trả phòng cho:", checkOutRoom.customerName);
        // Logic gọi API trả phòng ở đây...
        // Sau đó refresh lại data:
        fetchOccupiedRooms();
        
        // Reset state
    };

    const handleViewDetail = (room) => {
        setSelectedBooking(room);
        setIsDetailModalOpen(true);
    };

    // ... (Các hàm xử lý logic filter, pagination giữ nguyên không đổi) ...
    const normalizeDate = (d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date;
    };
    const today = useMemo(() => normalizeDate(new Date()), []);
    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            const checkOut = normalizeDate(room.checkOut);
            const isOverdue = checkOut < today;
            const isToday = checkOut.getTime() === today.getTime();
            if (statusFilter === "hom-nay" && !isToday) return false;
            if (statusFilter === "qua-han" && !isOverdue) return false;
            if (searchKeyword.trim()) {
                const k = searchKeyword.toLowerCase();
                return (
                    room.roomName.toLowerCase().includes(k) ||
                    room.customerName.toLowerCase().includes(k)
                );
            }
            return true;
        });
    }, [rooms, searchKeyword, statusFilter, today]);
    const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
    const paginatedRooms = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRooms.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredRooms, currentPage]);
    const stats = useMemo(
        () => ({
            total: rooms.length,
            today: rooms.filter((r) => normalizeDate(r.checkOut).getTime() === today.getTime()).length,
            overdue: rooms.filter((r) => normalizeDate(r.checkOut) < today).length,
        }),
        [rooms, today]
    );
    const getPaginationGroup = () => {
        const delta = 1;
        const range = [];
        const rangeDots = [];
        let last = null;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }
        range.forEach((i) => {
            if (last) {
                if (i - last === 2) rangeDots.push(last + 1);
                else if (i - last > 2) rangeDots.push("...");
            }
            rangeDots.push(i);
            last = i;
        });
        return rangeDots;
    };
    const handleJumpPage = (e) => {
        if (e.key === "Enter") {
            const p = Number(jumpPage);
            if (p >= 1 && p <= totalPages) {
                setCurrentPage(p);
                setJumpPage("");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans text-slate-800">
            
            {/* MODAL CHI TIẾT */}
            <BookingDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                booking={selectedBooking}
                onCheckOut={handleOpenCheckOutModal} // Truyền hàm mở modal xác nhận vào đây luôn
            />

            {/* MODAL XÁC NHẬN TRẢ PHÒNG (MỚI) */}
            <CheckOutModal
                isOpen={isCheckOutModalOpen}
                onClose={() => setIsCheckOutModalOpen(false)}
                onConfirm={handleConfirmCheckOut}
                room={checkOutRoom}
            />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="p-2 bg-[#28A9E0] rounded-lg text-white shadow-lg shadow-blue-200">
                                <BedDouble size={20} />
                            </span>
                            Quản Lý Lưu Trú
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 ml-1">
                            Danh sách khách đang sử dụng phòng
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={fetchOccupiedRooms}
                        icon={RefreshCw}
                        className={loading ? "opacity-70" : ""}
                    >
                        Làm mới
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: "Đang lưu trú", val: stats.total, icon: Users, color: "blue" },
                        { label: "Trả phòng hôm nay", val: stats.today, icon: Clock, color: "amber" },
                        { label: "Quá hạn trả", val: stats.overdue, icon: AlertCircle, color: "rose" },
                    ].map((s, i) => {
                        const C = COLOR_MAP[s.color];
                        return (
                            <div
                                key={i}
                                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden"
                            >
                                <div className={`absolute right-0 top-0 w-16 h-full bg-gradient-to-l ${C.gradient} to-transparent opacity-50`} />
                                <div>
                                    <p className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-1">
                                        {s.label}
                                    </p>
                                    <p className={`text-3xl font-bold ${C.text}`}>{s.val}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${C.bg} ${C.text}`}>
                                    <s.icon size={20} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  {/* TOOLBAR — giống 100% bản chuẩn */}
<div className="p-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row gap-4 justify-between items-center">

    {/* SEARCH */}
    <div className="relative w-full lg:w-96">
        <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
        />
        <input
            type="text"
            placeholder="Tìm phòng hoặc tên khách..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50
                       focus:bg-white focus:ring-2 focus:ring-[#28A9E0] text-sm"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
        />
    </div>

    {/* FILTER */}
    <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
        {[
            { id: "tat-ca", label: "Tất cả" },
            { id: "hom-nay", label: "Hôm nay" },
            { id: "qua-han", label: "Quá hạn" },
        ].map((f) => (
            <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                    ${
                        statusFilter === f.id
                            ? "bg-[#28A9E0] text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
            >
                {f.label}
            </button>
        ))}
    </div>
</div>


                    {/* Table */}
                    <OccupiedRoomsTable
                        data={paginatedRooms}
                        onCheckOut={handleOpenCheckOutModal} // Truyền hàm mở modal vào đây
                        onViewDetail={handleViewDetail}
                        loading={loading}
                    />

                    {/* Pagination */}
                    <div className="mt-auto border-t border-slate-100">
                        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
                            <span className="text-sm text-slate-500">
                                Hiển thị{" "}
                                <span className="font-semibold text-slate-700">{paginatedRooms.length}</span>{" "}
                                /{" "}
                                <span className="font-semibold text-slate-700">{filteredRooms.length}</span>{" "}
                                phòng
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="flex gap-1">
                                    {getPaginationGroup().map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => typeof item === "number" && setCurrentPage(item)}
                                            disabled={item === "..."}
                                            className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center 
                                                ${item === currentPage
                                                    ? "bg-[#28A9E0] text-white"
                                                    : item === "..."
                                                    ? "text-slate-400 cursor-default"
                                                    : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-2 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                                >
                                    <ChevronRight size={18} />
                                </button>
                                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                                    <span className="text-sm text-slate-500 whitespace-nowrap">Đi đến:</span>
                                    <input
                                        type="text"
                                        className="w-12 h-8 text-center rounded-lg border bg-white border-slate-200 text-sm focus:border-[#28A9E0] focus:ring-1 focus:ring-[#28A9E0]"
                                        placeholder={currentPage}
                                        value={jumpPage}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v === "" || /^[0-9]+$/.test(v)) setJumpPage(v);
                                        }}
                                        onKeyDown={handleJumpPage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerBookingsPage;




