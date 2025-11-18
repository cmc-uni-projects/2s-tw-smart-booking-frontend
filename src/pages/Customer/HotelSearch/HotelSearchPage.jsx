import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";
import SearchResultsList from "./SearchResultsList";
import propertyService from "@/services/property.service";

// Component Search Bar nhỏ gọn (để người dùng tìm lại nếu muốn)
import DestinationSelector from "@/components/search/DestinationSelector";
import DateSelector from "@/components/search/DateSelector";
import GuestSelector from "@/components/search/GuestSelector";
import { Search } from "lucide-react";
import Button from "@/components/common/Button/Button";

const HotelSearchPage = () => {
  const [searchParams] = useSearchParams();
  
  
  // State dữ liệu
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy params từ URL
  const keyword = searchParams.get("keyword") || "";
  const guests = searchParams.get("guests") || 1;
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  // Gọi API khi params thay đổi
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        // Gọi service đã viết ở bước trước
        const data = await propertyService.searchProperties(keyword, guests);
        setHotels(data);
      } catch (error) {
        console.error("Failed to search hotels:", error);
        // Có thể setHotels([]) hoặc hiện thông báo lỗi
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]); // Chạy lại khi URL thay đổi

  return (
      <div className="min-h-screen bg-gray-50 pb-12">
        
        {/* 1. Thanh tìm kiếm thu gọn (Header phụ) */}
        <div className="bg-white border-b border-gray-200 sticky top-[68px] z-30 shadow-sm py-3">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
             <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-2">
                   {/* Truyền tạm giá trị display (thực tế cần logic state để sửa lại search) */}
                   <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 truncate">
                      📍 {keyword || "Tất cả địa điểm"}
                   </div>
                   <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 truncate">
                      📅 {checkIn ? `${checkIn} - ${checkOut}` : "Chọn ngày"}
                   </div>
                   <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 truncate">
                      👥 {guests} Khách
                   </div>
                </div>
                <Button size="sm" className="w-full md:w-auto bg-[rgb(40,169,224)]">
                  <Search size={16} className="mr-2"/> Tìm kiếm lại
                </Button>
             </div>
          </div>
        </div>

        {/* 2. Nội dung chính */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar (Bộ lọc) - Giữ nguyên hoặc làm placeholder trước */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-32">
                <FilterSidebar />
              </div>
            </div>

            {/* Danh sách kết quả */}
            <div className="lg:col-span-3">
              <SearchResultsList hotels={hotels} loading={loading} />
            </div>

          </div>
        </div>
      </div>
  );
};

export default HotelSearchPage;