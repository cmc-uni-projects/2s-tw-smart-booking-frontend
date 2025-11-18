import React from "react";
import HotelListCard from "@/components/common/Card/HotelListCard";
import { Loader2, Map } from "lucide-react";
import EmptyState from "@/components/common/EmptyState/EmptyState";

const SearchResultsList = ({ hotels, loading }) => {
  // 1. Trạng thái đang tải
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 size={48} className="animate-spin text-[rgb(40,169,224)]" />
        <p className="text-gray-500 text-sm font-medium">Đang tìm kiếm khách sạn tốt nhất cho bạn...</p>
      </div>
    );
  }

  // 2. Trạng thái không có dữ liệu
  if (!hotels || hotels.length === 0) {
    return (
      <div className="py-10 bg-white rounded-xl border border-gray-200 shadow-sm">
        <EmptyState
          title="Không tìm thấy khách sạn nào"
          description="Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn."
          icon={<Map size={64} className="text-gray-300 mb-4" />}
        />
      </div>
    );
  }

  // 3. Hiển thị danh sách
  return (
    <div className="space-y-6">
      {/* Header kết quả */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          Tìm thấy <span className="text-[rgb(40,169,224)]">{hotels.length}</span> chỗ nghỉ phù hợp
        </h2>
        
        {/* (Optional) Sort dropdown có thể thêm ở đây */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sắp xếp theo:</span>
          <select className="text-sm border-none bg-transparent font-medium text-gray-700 focus:ring-0 cursor-pointer">
            <option>Được gợi ý</option>
            <option>Giá thấp nhất</option>
            <option>Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      {/* Danh sách Cards */}
      <div className="flex flex-col gap-5">
        {hotels.map((hotel) => (
          <HotelListCard key={hotel.propertyId} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsList;