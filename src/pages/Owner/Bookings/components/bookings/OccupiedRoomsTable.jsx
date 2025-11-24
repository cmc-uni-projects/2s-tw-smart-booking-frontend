import React from "react";
import { Home, Calendar, LogOut, RefreshCw } from "lucide-react";

// IMPORT TỪ FOLDER COMMON (Đi ra 1 cấp -> vào common)
import UserAvatar from "../common/UserAvatar";
import StatusBadge from "../common/StatusBadge";
import Button from "../common/Button";

const OccupiedRoomsTable = ({ data, onCheckOut, onViewDetail, loading }) => {
  const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  
  const parseRoomName = (fullName) => {
    const parts = fullName.split("(");
    return { name: parts[0].trim(), number: parts[1] ? parts[1].replace(")", "") : "" };
  };

  const normalizeDate = (d) => { const date = new Date(d); date.setHours(0,0,0,0); return date; };

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="animate-spin mb-2 text-[#28A9E0]" size={24} />
        <span>Đang tải dữ liệu phòng...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center border-t border-slate-100 text-slate-500 italic">
        Không tìm thấy phòng nào phù hợp với bộ lọc.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-blue-50 border-b border-blue-100 text-xs uppercase tracking-wider text-slate-800 font-bold">
            <th className="px-6 py-4">Phòng</th>
            <th className="px-6 py-4">Khách hàng</th>
            <th className="px-6 py-4">Thời gian lưu trú</th>
            <th className="px-6 py-4 text-right">Tổng tiền</th>
            <th className="px-6 py-4 text-center">Trạng thái</th>
            <th className="px-6 py-4 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((room) => {
            const today = normalizeDate(new Date());
            const checkOutDate = normalizeDate(room.checkOut);
            
            const isOverdue = checkOutDate < today;
            const isToday = checkOutDate.getTime() === today.getTime();
            
            let statusType = 'active';
            let statusText = 'Đang ở';
            if (isOverdue) { statusType = 'overdue'; statusText = 'Quá hạn'; }
            else if (isToday) { statusType = 'today'; statusText = 'Trả hôm nay'; }

            const { name, number } = parseRoomName(room.roomName);

            return (
              <tr key={room.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-[#28A9E0] transition-colors">{name}</span>
                    <span className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                      <Home size={10} /> {number}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={room.customerName} />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{room.customerName}</p>
                      <p className="text-xs text-slate-400">Khách lẻ</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center text-xs text-slate-600">
                      <Calendar size={12} className="mr-2 text-slate-400" />
                      <span>In: {new Date(room.checkIn).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-600">
                      <LogOut size={12} className={`mr-2 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
                      <span className={isOverdue ? 'text-rose-600 font-bold' : ''}>
                        Out: {new Date(room.checkOut).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-slate-700 block">
                    {formatCurrency(room.totalPrice)}
                  </span>
                  <span className="text-xs text-slate-400">Chưa thanh toán</span>
                </td>

                <td className="px-6 py-4 text-center">
                  <StatusBadge type={statusType} text={statusText} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-4">
                    <Button size="sm" variant="soft" onClick={() => onViewDetail(room)}>
                      Chi tiết
                    </Button>
                    <Button size="sm" variant="dangerSoft" onClick={() => onCheckOut(room.id)}>
                      Trả phòng
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OccupiedRoomsTable;