// File: src/pages/Owner/Bookings/OwnerBookingsPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import {
    Users, Clock, AlertCircle, BedDouble, RefreshCw, Search, ChevronLeft, ChevronRight, Building2, CalendarCheck
} from "lucide-react";

import Button from "./components/common/Button";
import OccupiedRoomsTable from "./components/bookings/OccupiedRoomsTable";
import BookingDetailModal from "./BookingDetailModal";
import CheckOutModal from "./CheckOutModal";

// --- IMPORT SERVICES (Đã sửa import default) ---
import bookingService from "../../../services/booking.service"; 
import propertyService from "../../../services/property.service"; 

const ITEMS_PER_PAGE = 10;
const COLOR_MAP = {
    blue: { text: "text-blue-600", bg: "bg-blue-50", gradient: "from-blue-50" },
    amber: { text: "text-amber-600", bg: "bg-amber-50", gradient: "from-amber-50" },
    rose: { text: "text-rose-600", bg: "bg-rose-50", gradient: "from-rose-50" },
    green: { text: "text-emerald-600", bg: "bg-emerald-50", gradient: "from-emerald-50" }
};

const OwnerBookingsPage = () => {
    const { propertyId } = useParams();
    const navigate = useNavigate();

    // --- STATE QUẢN LÝ ---
    const [myProperties, setMyProperties] = useState([]);
    const [selectedPropId, setSelectedPropId] = useState(propertyId || "");

    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);
    
    // UI State
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // Default: Tất cả
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState("");

    // Modal State
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [checkOutRoom, setCheckOutRoom] = useState(null); 
    const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

    // --- 1. LOAD DANH SÁCH PROPERTY ---
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await propertyService.getOwnerActiveProperties();
                // Fix lỗi: Lấy data từ response chuẩn ApiResponse
                const props = res.data || []; 

                setMyProperties(props);

                // Logic tự động chọn property đầu tiên nếu chưa có ID
                if (!propertyId && props.length > 0) {
                    const firstId = props[0].propertyId;
                    setSelectedPropId(firstId);
                    // navigate(`/owner/bookings/${firstId}`, { replace: true }); // (Optional)
                } 
                else if (propertyId && propertyId !== selectedPropId) {
                    setSelectedPropId(propertyId);
                }
            } catch (error) {
                console.error("Lỗi tải danh sách khách sạn:", error);
                setMyProperties([]);
            }
        };
        fetchProperties();
    }, [propertyId]);

    // --- 2. LOAD BOOKINGS ---
    useEffect(() => {
        if (selectedPropId) {
            fetchOccupiedRooms(selectedPropId);
        } else {
            setRooms([]); // Reset nếu không có property nào được chọn
        }
        
        // Reset state khi đổi khách sạn
        setIsCheckOutModalOpen(false);
        setCheckOutRoom(null);
        setCurrentPage(1);
    }, [selectedPropId]);

    // Helper map status
    const mapStatusBackendToFrontend = (backendStatus) => {
        switch (backendStatus) {
            case "PENDING_PAYMENT": return "Chờ thanh toán";
            case "CONFIRMED": return "Đang hoạt động";
            case "CANCELLED": return "Đã hủy";
            case "COMPLETED": return "Đã trả phòng";
            default: return backendStatus;
        }
    };

    const fetchOccupiedRooms = async (propId) => {
        setLoading(true);
        try {
            // Gọi API lấy booking theo Property ID
            const data = await bookingService.getBookingsByPropertyId(propId);
            
            const mappedData = data.map((b) => ({
                id: b.bookingId,
                bookingCode: `BK-${b.bookingId}`,
                roomName: b.roomName || "Chưa xếp phòng",
                
                customerName: b.user ? b.user.fullName : "Khách vãng lai",
                phone: b.user ? b.user.phoneNumber : "",
                email: b.user ? b.user.email : "",
                
                checkIn: b.checkInDate,
                checkOut: b.checkOutDate,
                totalPrice: b.totalPrice,
                guestCount: `${b.guestCount} người`,
                
                paymentMethod: b.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán",
                status: mapStatusBackendToFrontend(b.status),
                originalStatus: b.status,
                
                specialRequest: "Không"
            }));

            // Sắp xếp mới nhất lên đầu
            setRooms(mappedData.reverse());
        } catch (error) {
            console.error("Lỗi tải booking:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePropertyChange = (e) => {
        const newId = e.target.value;
        setSelectedPropId(newId);
        navigate(`/owner/bookings/${newId}`);
    };

    // --- ACTIONS ---
    const handleOpenCheckOutModal = (roomId) => {
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            setCheckOutRoom(room);
            setIsCheckOutModalOpen(true);
            setIsDetailModalOpen(false);
        }
    };

    const handleConfirmCheckOut = async () => {
        if (!checkOutRoom) return;
        try {
            // Gọi service checkout (Cần đảm bảo backend đã có API này hoặc giả lập)
            await bookingService.checkOutBooking(checkOutRoom.id); // <--- Cần hàm này trong service
            
            // Refresh lại data
            await fetchOccupiedRooms(selectedPropId);
            
            setIsCheckOutModalOpen(false);
            setCheckOutRoom(null);
        } catch (error) {
            console.error(error);
            alert("Lỗi khi trả phòng: " + (error.message || "Không xác định"));
        }
    };

    const handleViewDetail = (room) => {
        setSelectedBooking(room);
        setIsDetailModalOpen(true);
    };

    // --- LOGIC FILTER (MỚI: THEO QUY TRÌNH) ---
    const normalizeDate = (d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date;
    };
    const today = useMemo(() => normalizeDate(new Date()), []);

    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            const checkIn = normalizeDate(room.checkIn);
            const checkOut = normalizeDate(room.checkOut);
            
            // 1. FILTER LOGIC
            let matchStatus = true;
            switch (statusFilter) {
                case "upcoming": // Sắp đến (Confirmed + CheckIn >= Today)
                    matchStatus = room.originalStatus === 'CONFIRMED' && checkIn >= today;
                    break;
                case "in-house": // Đang ở (Confirmed + CheckIn <= Today <= CheckOut)
                    matchStatus = room.originalStatus === 'CONFIRMED' && checkIn <= today && checkOut >= today;
                    break;
                case "pending": // Chờ thanh toán
                    matchStatus = room.originalStatus === 'PENDING_PAYMENT';
                    break;
                case "completed": // Lịch sử (Completed/Cancelled)
                    matchStatus = room.originalStatus === 'COMPLETED' || room.originalStatus === 'CANCELLED';
                    break;
                case "all":
                default:
                    matchStatus = true;
            }

            if (!matchStatus) return false;

            // 2. SEARCH LOGIC
            if (searchKeyword.trim()) {
                const k = searchKeyword.toLowerCase();
                return (
                    (room.roomName && room.roomName.toLowerCase().includes(k)) ||
                    (room.customerName && room.customerName.toLowerCase().includes(k)) ||
                    (room.bookingCode && room.bookingCode.toLowerCase().includes(k))
                );
            }
            return true;
        });
    }, [rooms, searchKeyword, statusFilter, today]);

    // Stats tính toán dựa trên danh sách đầy đủ
    const stats = useMemo(() => {
        const inHouse = rooms.filter(r => r.originalStatus === 'CONFIRMED' && normalizeDate(r.checkIn) <= today && normalizeDate(r.checkOut) >= today).length;
        const upcoming = rooms.filter(r => r.originalStatus === 'CONFIRMED' && normalizeDate(r.checkIn) >= today).length;
        const pending = rooms.filter(r => r.originalStatus === 'PENDING_PAYMENT').length;
        
        return { inHouse, upcoming, pending };
    }, [rooms, today]);

    // --- PAGINATION ---
    const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
    const paginatedRooms = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRooms.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredRooms, currentPage]);

    const getPaginationGroup = () => { /* ... Logic cũ giữ nguyên ... */
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

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans text-slate-800">
            <BookingDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                booking={selectedBooking}
                onCheckOut={handleOpenCheckOutModal}
            />

            <CheckOutModal
                isOpen={isCheckOutModalOpen}
                onClose={() => setIsCheckOutModalOpen(false)}
                onConfirm={handleConfirmCheckOut}
                room={checkOutRoom}
            />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="p-2 bg-[#28A9E0] rounded-lg text-white shadow-lg shadow-blue-200">
                                <BedDouble size={20} />
                            </span>
                            Quản Lý Lưu Trú
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 ml-1">
                            Theo dõi khách hàng check-in, check-out và thanh toán
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select 
                                className="pl-10 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-[#28A9E0] outline-none min-w-[220px]"
                                value={selectedPropId}
                                onChange={handlePropertyChange}
                            >
                                <option value="" disabled>-- Chọn khách sạn --</option>
                                {myProperties.map(p => (
                                    <option key={p.propertyId} value={p.propertyId}>
                                        {p.propertyName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => selectedPropId && fetchOccupiedRooms(selectedPropId)}
                            icon={RefreshCw}
                            className={loading ? "opacity-70" : ""}
                        >
                            Làm mới
                        </Button>
                    </div>
                </div>

                {!selectedPropId && (
                     <div className="p-10 text-center bg-white rounded-xl border border-dashed border-slate-300">
                        <Building2 className="mx-auto text-slate-300 mb-3" size={48} />
                        <p className="text-slate-500 font-medium">Vui lòng chọn một khách sạn để xem dữ liệu.</p>
                     </div>
                )}

                {selectedPropId && (
                    <>
                        {/* --- STATS CARDS --- */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: "Khách đang ở", val: stats.inHouse, icon: Users, color: "blue" },
                                { label: "Khách sắp đến", val: stats.upcoming, icon: CalendarCheck, color: "green" },
                                { label: "Chờ thanh toán", val: stats.pending, icon: AlertCircle, color: "rose" },
                            ].map((s, i) => {
                                const C = COLOR_MAP[s.color];
                                return (
                                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden">
                                        <div className={`absolute right-0 top-0 w-16 h-full bg-gradient-to-l ${C.gradient} to-transparent opacity-50`} />
                                        <div>
                                            <p className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-1">{s.label}</p>
                                            <p className={`text-3xl font-bold ${C.text}`}>{s.val}</p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${C.bg} ${C.text}`}>
                                            <s.icon size={20} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* --- MAIN CONTENT --- */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            
                            {/* Toolbar */}
                            <div className="p-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row gap-4 justify-between items-center">
                                {/* Search */}
                                <div className="relative w-full lg:w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Tìm tên khách, mã BK, tên phòng..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#28A9E0] text-sm"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                </div>

                                {/* Filter Tabs (New Logic) */}
                                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                                    {[
                                        { id: "all", label: "Tất cả" },
                                        { id: "upcoming", label: "Sắp đến" },
                                        { id: "in-house", label: "Đang ở" },
                                        { id: "pending", label: "Chờ TT" },
                                        { id: "completed", label: "Lịch sử" },
                                    ].map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setStatusFilter(f.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
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
                                onCheckOut={handleOpenCheckOutModal}
                                onViewDetail={handleViewDetail}
                                loading={loading}
                            />

                            {/* Pagination */}
                            <div className="mt-auto border-t border-slate-100">
                                <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
                                    <span className="text-sm text-slate-500">
                                        Hiển thị <span className="font-semibold text-slate-700">{paginatedRooms.length}</span> / <span className="font-semibold text-slate-700">{filteredRooms.length}</span> đơn
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"><ChevronLeft size={18} /></button>
                                        <div className="flex gap-1">
                                            {getPaginationGroup().map((item, idx) => (
                                                <button key={idx} onClick={() => typeof item === "number" && setCurrentPage(item)} disabled={item === "..."} className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center ${item === currentPage ? "bg-[#28A9E0] text-white" : item === "..." ? "text-slate-400 cursor-default" : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"}`}>{item}</button>
                                            ))}
                                        </div>
                                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"><ChevronRight size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OwnerBookingsPage;