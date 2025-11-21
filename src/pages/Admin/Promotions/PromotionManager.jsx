import React, { useState, useMemo } from "react";
import Table from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import PromotionFormModal from "./components/PromotionFormModal";
import {
  Plus, Edit, Trash2, Tag, Search, Filter,
  Copy, CheckCircle2, AlertCircle, Ticket, Coins,
  ChevronLeft, ChevronRight
} from "lucide-react";

// --- COMPONENT CON: THẺ THỐNG KÊ ---
const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-transform hover:scale-105">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-gray-800 mt-1">{value}</h4>
    </div>
    <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
      <Icon size={24} />
    </div>
  </div>
);

const PromotionManager = () => {
  // 1. Mock Data (30 items để test phân trang)
  const [promotions, setPromotions] = useState([
    { id: 1, code: "SUMMER2025", name: "Hè rực rỡ - Giảm giá cực sâu", type: "PERCENT", value: 20, quantity: 100, minOrder: 500000, maxDiscount: 200000, startDate: "2025-06-01", endDate: "2025-08-31", isActive: true },
    { id: 2, code: "WELCOME", name: "Chào bạn mới", type: "FIXED", value: 100000, quantity: 50, minOrder: 0, maxDiscount: 100000, startDate: "2025-01-01", endDate: "2025-12-31", isActive: true },
    { id: 3, code: "VIP_ONLY", name: "Tri ân khách hàng VIP", type: "PERCENT", value: 15, quantity: 20, minOrder: 1000000, maxDiscount: 500000, startDate: "2025-11-10", endDate: "2025-11-20", isActive: false },
    { id: 4, code: "TEST_CODE", name: "Mã test hệ thống", type: "FIXED", value: 10000, quantity: 10, minOrder: 0, maxDiscount: 10000, startDate: "2025-12-01", endDate: "2025-12-31", isActive: false },
    { id: 5, code: "BLACK_FRIDAY", name: "Siêu sale Black Friday", type: "PERCENT", value: 50, quantity: 500, minOrder: 200000, maxDiscount: 500000, startDate: "2025-11-25", endDate: "2025-11-30", isActive: true },
    { id: 6, code: "TET_HOLIDAY", name: "Mừng xuân Ất Tỵ", type: "FIXED", value: 88000, quantity: 88, minOrder: 500000, maxDiscount: 88000, startDate: "2025-01-20", endDate: "2025-02-10", isActive: true },
    { id: 7, code: "FLASH_SALE_11", name: "Săn sale ngày đôi 11/11", type: "PERCENT", value: 11, quantity: 111, minOrder: 0, maxDiscount: 111000, startDate: "2025-11-11", endDate: "2025-11-11", isActive: false },
    { id: 8, code: "FREESHIP", name: "Miễn phí vận chuyển (Demo)", type: "FIXED", value: 30000, quantity: 1000, minOrder: 150000, maxDiscount: 30000, startDate: "2025-01-01", endDate: "2025-12-31", isActive: true },
    { id: 9, code: "WEEKEND_VIBES", name: "Thư giãn cuối tuần", type: "PERCENT", value: 10, quantity: 200, minOrder: 300000, maxDiscount: 50000, startDate: "2025-03-01", endDate: "2025-03-31", isActive: true },
    { id: 10, code: "SORRY50", name: "Voucher xin lỗi sự cố", type: "FIXED", value: 50000, quantity: 100, minOrder: 0, maxDiscount: 50000, startDate: "2025-05-01", endDate: "2025-05-05", isActive: false },
    { id: 11, code: "FIRST_ORDER", name: "Đơn hàng đầu tiên", type: "PERCENT", value: 25, quantity: 1000, minOrder: 0, maxDiscount: 100000, startDate: "2025-01-01", endDate: "2025-12-31", isActive: true },
    { id: 12, code: "LOYALTY", name: "Khách hàng thân thiết", type: "PERCENT", value: 5, quantity: 9999, minOrder: 0, maxDiscount: 1000000, startDate: "2025-01-01", endDate: "2025-12-31", isActive: true },
    { id: 13, code: "SUMMER_SALE", name: "Xả kho hè 2025", type: "PERCENT", value: 30, quantity: 50, minOrder: 200000, maxDiscount: 150000, startDate: "2025-07-01", endDate: "2025-07-15", isActive: true },
    { id: 14, code: "WINTER_COMING", name: "Đón đông sang", type: "FIXED", value: 50000, quantity: 300, minOrder: 500000, maxDiscount: 50000, startDate: "2025-10-01", endDate: "2025-12-31", isActive: true },
    { id: 15, code: "MID_AUTUMN", name: "Vui tết trung thu", type: "PERCENT", value: 15, quantity: 100, minOrder: 100000, maxDiscount: 50000, startDate: "2025-09-01", endDate: "2025-09-30", isActive: false },
    { id: 16, code: "NATIONAL_DAY", name: "Mừng quốc khánh 2/9", type: "PERCENT", value: 29, quantity: 290, minOrder: 0, maxDiscount: 290000, startDate: "2025-09-02", endDate: "2025-09-02", isActive: true },
    { id: 17, code: "HALLOWEEN", name: "Lễ hội hóa trang", type: "FIXED", value: 66000, quantity: 666, minOrder: 0, maxDiscount: 66000, startDate: "2025-10-30", endDate: "2025-10-31", isActive: false },
    { id: 18, code: "SINGLE_DAY", name: "Lễ độc thân 11/11", type: "PERCENT", value: 11, quantity: 1111, minOrder: 0, maxDiscount: 111111, startDate: "2025-11-11", endDate: "2025-11-11", isActive: true },
    { id: 19, code: "DOUBLE_12", name: "Siêu sale 12/12", type: "PERCENT", value: 12, quantity: 1212, minOrder: 0, maxDiscount: 120000, startDate: "2025-12-12", endDate: "2025-12-12", isActive: true },
    { id: 20, code: "NEW_YEAR", name: "Chào năm mới 2026", type: "FIXED", value: 202600, quantity: 200, minOrder: 1000000, maxDiscount: 202600, startDate: "2026-01-01", endDate: "2026-01-31", isActive: false },
    { id: 21, code: "VALENTINE", name: "Mùa yêu thương", type: "PERCENT", value: 14, quantity: 142, minOrder: 0, maxDiscount: 140000, startDate: "2026-02-14", endDate: "2026-02-14", isActive: true },
    { id: 22, code: "WOMEN_DAY", name: "Mừng 8/3", type: "FIXED", value: 83000, quantity: 830, minOrder: 0, maxDiscount: 83000, startDate: "2026-03-08", endDate: "2026-03-08", isActive: true },
    { id: 23, code: "LABOR_DAY", name: "Quốc tế lao động", type: "PERCENT", value: 5, quantity: 500, minOrder: 0, maxDiscount: 50000, startDate: "2026-05-01", endDate: "2026-05-01", isActive: true },
    { id: 24, code: "CHILDREN_DAY", name: "Quốc tế thiếu nhi", type: "FIXED", value: 100000, quantity: 100, minOrder: 0, maxDiscount: 100000, startDate: "2026-06-01", endDate: "2026-06-01", isActive: false },
    { id: 25, code: "BACK_2_SCHOOL", name: "Tựu trường rộn rã", type: "PERCENT", value: 10, quantity: 1000, minOrder: 0, maxDiscount: 100000, startDate: "2026-09-05", endDate: "2026-09-30", isActive: true },
    { id: 26, code: "APP_ONLY", name: "Đặt trên App", type: "FIXED", value: 30000, quantity: 5000, minOrder: 100000, maxDiscount: 30000, startDate: "2025-01-01", endDate: "2025-12-31", isActive: true },
    { id: 27, code: "LATE_NIGHT", name: "Cú đêm săn sale", type: "PERCENT", value: 50, quantity: 50, minOrder: 0, maxDiscount: 50000, startDate: "2025-01-01", endDate: "2025-12-31", isActive: true },
    { id: 28, code: "EARLY_BIRD", name: "Đặt sớm giảm sâu", type: "PERCENT", value: 20, quantity: 100, minOrder: 2000000, maxDiscount: 500000, startDate: "2025-01-01", endDate: "2025-12-31", isActive: true },
    { id: 29, code: "PAY_DAY", name: "Ngày lương về", type: "PERCENT", value: 10, quantity: 500, minOrder: 0, maxDiscount: 100000, startDate: "2025-01-01", endDate: "2025-12-31", isActive: true },
    { id: 30, code: "SECRET_GIFT", name: "Món quà bí mật", type: "FIXED", value: 99999, quantity: 9, minOrder: 0, maxDiscount: 99999, startDate: "2025-12-24", endDate: "2025-12-25", isActive: false },
  ]);

  // State quản lý
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  // Logic Lọc dữ liệu
  const filteredPromotions = useMemo(() => {
    return promotions.filter(item => {
      const matchesSearch =
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "ALL" ||
        (filterStatus === "ACTIVE" ? item.isActive : !item.isActive);
      const matchesType =
        filterType === "ALL" || item.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [promotions, searchTerm, filterStatus, filterType]);

  // Logic Phân trang
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPromotions.slice(start, start + itemsPerPage);
  }, [filteredPromotions, currentPage]);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterType]);

  // ✅ LOGIC MỚI: TẠO DANH SÁCH TRANG THÔNG MINH (CÓ DẤU ...)
  const getPaginationGroup = () => {
    const delta = 1; // Số trang hiển thị 2 bên trang hiện tại
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
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    });

    return rangeWithDots;
  };

  const stats = {
    total: promotions.length,
    active: promotions.filter(p => p.isActive).length,
    inactive: promotions.filter(p => !p.isActive).length,
  };

  const columns = [
    { key: "codeDisplay", label: "Mã Code" },
    { key: "name", label: "Tên chương trình" },
    { key: "details", label: "Chi tiết giảm" },
    { key: "quantity", label: "SL" },
    { key: "endDate", label: "Hết hạn" },
    { key: "statusLabel", label: "Trạng thái" },
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Đã copy: ${text}`);
  };

  const getDisplayData = (data) => {
    return data.map(item => ({
      ...item,
      codeDisplay: (
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => handleCopy(item.code)}
          title="Click để copy"
        >
          <span className={`font-mono font-bold px-2 py-1 rounded border transition-colors
            ${item.isActive
              ? 'text-[rgb(40,169,224)] bg-blue-50 border-blue-100 group-hover:bg-blue-100'
              : 'text-orange-600 bg-orange-50 border-orange-100 group-hover:bg-orange-100'
            }
          `}>
            {item.code}
          </span>
          <Copy size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
        </div>
      ),
      details: item.type === 'PERCENT'
        ? `${item.value}% (Tối đa ${Number(item.maxDiscount).toLocaleString()}đ)`
        : `${Number(item.value).toLocaleString()}đ`,

      statusLabel: item.isActive ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Hoạt động
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
           <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Tạm dừng
        </span>
      )
    }));
  };

  const handleSave = (data) => {
    if (editingPromo) {
      setPromotions(prev => prev.map(item => item.id === editingPromo.id ? { ...data, id: item.id } : item));
    } else {
      const newId = Date.now();
      setPromotions(prev => [{ ...data, id: newId }, ...prev]);
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
          <p className="text-gray-500 mt-1 text-sm">
            Tạo và quản lý các mã giảm giá, voucher cho khách hàng.
          </p>
        </div>
        <Button onClick={() => { setEditingPromo(null); setIsModalOpen(true); }} leftIcon={<Plus size={18} />}>
          Thêm mã mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Tổng mã khuyến mãi" value={stats.total} icon={Ticket} bgClass="bg-blue-50" colorClass="text-blue-600" />
        <StatCard title="Đang hoạt động" value={stats.active} icon={CheckCircle2} bgClass="bg-green-50" colorClass="text-green-600" />
        <StatCard title="Đã tạm dừng" value={stats.inactive} icon={AlertCircle} bgClass="bg-orange-50" colorClass="text-orange-600" />
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã code hoặc tên..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-2 md:pb-0">
           <select className={selectClassName} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="INACTIVE">Tạm dừng</option>
           </select>
           <select className={selectClassName} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="ALL">Tất cả loại giảm</option>
              <option value="PERCENT">Giảm theo %</option>
              <option value="FIXED">Giảm tiền mặt</option>
           </select>
           {(searchTerm || filterStatus !== 'ALL' || filterType !== 'ALL') && (
             <button onClick={() => { setSearchTerm(""); setFilterStatus("ALL"); setFilterType("ALL"); }} className="px-4 py-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-medium whitespace-nowrap">
               Xóa lọc
             </button>
           )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
        {filteredPromotions.length > 0 ? (
          <>
            <Table columns={columns} data={getDisplayData(paginatedData)} />

            <div className="mt-auto border-t border-gray-100">
                {/* Pagination Controls */}
                <div className="px-6 py-4 flex items-center justify-between bg-gray-50/50">
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

                        {/* ✅ RENDER DANH SÁCH TRANG THÔNG MINH */}
                        <div className="flex gap-1">
                            {getPaginationGroup().map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof item === 'number' && setCurrentPage(item)}
                                    disabled={item === '...'}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center
                                        ${item === currentPage
                                            ? 'bg-[rgb(40,169,224)] text-white shadow-sm'
                                            : item === '...'
                                                ? 'bg-transparent text-gray-400 cursor-default'
                                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }
                                    `}
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
                    </div>
                </div>

                {/* Debug Area */}
                <div className="p-4 border-t bg-gray-50 text-sm text-gray-500">
                    <div className="flex items-center gap-2 mb-3">
                        <Edit className="w-4 h-4"/> <span className="font-semibold">Thao tác nhanh (Trang {currentPage}):</span>
                    </div>
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedData.map(p => (
                            <div key={p.id} className={`flex justify-between items-center p-3 border rounded-xl shadow-sm hover:shadow-md transition-all duration-200
                                ${p.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-80'}
                            `}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${p.type === 'PERCENT' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                                       {p.type === 'PERCENT' ? <PercentIcon size={18}/> : <Coins size={18}/>}
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm ${p.isActive ? 'text-gray-800' : 'text-orange-600'}`}>
                                            {p.code}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate max-w-[120px]">{p.name}</div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                     <button onClick={() => { setEditingPromo(p); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit size={16} />
                                     </button>
                                     <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                     </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search size={40} className="text-gray-300" />
             </div>
             <h3 className="text-lg font-semibold text-gray-800">Không tìm thấy kết quả</h3>
             <button onClick={() => { setSearchTerm(""); setFilterStatus("ALL"); setFilterType("ALL"); }} className="mt-4 text-blue-600 font-medium hover:underline">
               Xóa bộ lọc & tìm lại
             </button>
          </div>
        )}
      </div>

      <PromotionFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingPromo}
      />
    </div>
  );
};

const PercentIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
);

export default PromotionManager;