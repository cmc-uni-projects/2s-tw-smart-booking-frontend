import React, { useState, useEffect, useMemo } from "react";
import { Users, Clock, AlertCircle, BedDouble, RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react";

// Import component theo cấu trúc thư mục của bạn
import Button from "./components/common/Button";
import OccupiedRoomsTable from "./components/bookings/OccupiedRoomsTable";

// Dữ liệu mẫu (Nhiều hơn 9 để test phân trang)
const MOCK_DATA = [
  { id: 301, roomName: "Deluxe King (P. 301)", customerName: "Nguyễn Văn A", checkIn: "2025-11-15", checkOut: "2025-11-19", totalPrice: 8800000 },
  { id: 502, roomName: "Suite View (P. 502)", customerName: "Trần Văn B", checkIn: "2025-11-10", checkOut: "2025-11-18", totalPrice: 15400000 },
  { id: 205, roomName: "Standard Queen (P. 205)", customerName: "Lê Thị C", checkIn: "2025-11-19", checkOut: new Date().toISOString().split('T')[0], totalPrice: 1500000 },
  { id: 102, roomName: "Single Room (P. 102)", customerName: "Phạm Văn D", checkIn: "2025-11-19", checkOut: new Date().toISOString().split('T')[0], totalPrice: 800000 },
  { id: 401, roomName: "Family Room (P. 401)", customerName: "Gia đình Smith", checkIn: "2025-11-17", checkOut: new Date().toISOString().split('T')[0], totalPrice: 4500000 },
  { id: 510, roomName: "Penthouse (P. 510)", customerName: "John Doe", checkIn: "2025-11-15", checkOut: "2025-11-25", totalPrice: 35000000 },
  { id: 404, roomName: "Superior Twin (P. 404)", customerName: "Lý Tiêu Long", checkIn: "2025-11-20", checkOut: "2025-11-23", totalPrice: 3200000 },
  { id: 305, roomName: "Deluxe Double (P. 305)", customerName: "Hoàng Thùy Linh", checkIn: "2025-11-20", checkOut: "2025-11-24", totalPrice: 4800000 },
  { id: 201, roomName: "Standard (P. 201)", customerName: "Ngô Bảo Châu", checkIn: "2025-11-21", checkOut: "2025-11-22", totalPrice: 900000 },
  // Dữ liệu trang 2
  { id: 601, roomName: "Garden Villa (P. 601)", customerName: "Test Trang 2", checkIn: "2025-11-22", checkOut: "2025-11-25", totalPrice: 5500000 },
  { id: 602, roomName: "Beach Villa (P. 602)", customerName: "Khách số 11", checkIn: "2025-11-22", checkOut: "2025-11-25", totalPrice: 6500000 },
];

const ITEMS_PER_PAGE = 9; // Số lượng hiển thị 1 trang

const OwnerBookingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("tat-ca");
  
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);

  // ---------------------------------------------------------------------------------------
  // 📍 VỊ TRÍ GỌI API (Backend Integration)
  // ---------------------------------------------------------------------------------------
  const fetchOccupiedRooms = async () => {
    setLoading(true);
    try {
      // --- CODE GỌI API THỰC TẾ (Bỏ comment khi ghép API) ---
      // const response = await axios.get('https://api.yourdomain.com/rooms/occupied');
      // setRooms(response.data);
      
      // --- GIẢ LẬP ---
      await new Promise((resolve) => setTimeout(resolve, 600));
      setRooms(MOCK_DATA);
    } catch (error) {
      console.error("Lỗi tải danh sách phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccupiedRooms();
  }, []);

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, statusFilter]);

  const handleCheckOut = (roomId) => {
    const room = rooms.find((r) => r.id === roomId);
    if (window.confirm(`Xác nhận trả phòng và thanh toán cho khách: ${room?.customerName}?`)) {
      alert(`Đã trả phòng thành công!\nTổng thu: ${new Intl.NumberFormat("vi-VN").format(room.totalPrice)}₫`);
      fetchOccupiedRooms(); // Reload data
    }
  };

  const handleViewDetail = (room) => {
    alert(`(Chi tiết)\nKhách: ${room.customerName}\nPhòng: ${room.roomName}`);
  };

  const normalizeDate = (d) => { const date = new Date(d); date.setHours(0,0,0,0); return date; };
  const today = useMemo(() => normalizeDate(new Date()), []);

  // 1. Lọc dữ liệu
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const checkOut = normalizeDate(room.checkOut);
      const isOverdue = checkOut < today;
      const isToday = checkOut.getTime() === today.getTime();

      if (statusFilter === "hom-nay" && !isToday) return false;
      if (statusFilter === "qua-han" && !isOverdue) return false;
      
      if (searchKeyword.trim()) {
        const k = searchKeyword.toLowerCase();
        return room.roomName.toLowerCase().includes(k) || room.customerName.toLowerCase().includes(k);
      }
      return true;
    });
  }, [rooms, searchKeyword, statusFilter, today]);

  // 2. Logic Phân trang
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRooms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRooms, currentPage]);

  // 3. Stats
  const stats = useMemo(() => ({
    total: rooms.length,
    today: rooms.filter(r => normalizeDate(r.checkOut).getTime() === today.getTime()).length,
    overdue: rooms.filter(r => normalizeDate(r.checkOut) < today).length
  }), [rooms, today]);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="p-2 bg-[#28A9E0] rounded-lg text-white shadow-lg shadow-blue-200"><BedDouble size={20} /></span>
              Quản Lý Lưu Trú
            </h1>
            <p className="text-slate-500 text-sm mt-1 ml-1">Danh sách khách hàng đang sử dụng phòng</p>
          </div>
          <Button variant="outline" onClick={fetchOccupiedRooms} icon={RefreshCw} className={loading ? "opacity-70" : ""}>
            Làm mới
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Đang lưu trú", val: stats.total, icon: Users, color: "blue" },
            { label: "Trả phòng hôm nay", val: stats.today, icon: Clock, color: "amber" },
            { label: "Quá hạn trả", val: stats.overdue, icon: AlertCircle, color: "rose" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className={`absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-${stat.color}-50 to-transparent opacity-50`}></div>
              <div>
                <p className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.val}</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm phòng hoặc tên khách..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#28A9E0] focus:border-[#28A9E0] outline-none transition-all text-sm"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
              {[
                {id: 'tat-ca', label: 'Tất cả'},
                {id: 'hom-nay', label: 'Hôm nay'},
                {id: 'qua-han', label: 'Quá hạn'},
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${statusFilter === f.id ? 'bg-[#28A9E0] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <OccupiedRoomsTable 
            data={paginatedRooms} 
            onCheckOut={handleCheckOut} 
            onViewDetail={handleViewDetail}
            loading={loading} 
          />
          
          {/* FOOTER PHÂN TRANG */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <span>
              Hiển thị {paginatedRooms.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredRooms.length)} trong tổng số {filteredRooms.length} phòng
            </span>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="px-2 border border-slate-200 bg-white disabled:opacity-40"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} /> Trước
              </Button>

              <span className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-700 font-medium">
                Trang {currentPage} / {totalPages || 1}
              </span>

              <Button 
                size="sm" 
                variant="outline"
                className="px-2 border border-slate-200 bg-white disabled:opacity-40"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Sau <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerBookingsPage;