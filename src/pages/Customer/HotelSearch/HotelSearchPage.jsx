import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";
import SearchResultsList from "./SearchResultsList";
import propertyService from "@/services/property.service";
import SearchBox from "@/components/search/SearchBox"; // Import component tái sử dụng

const HotelSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy params từ URL để truyền vào SearchBox làm giá trị mặc định
  const initialSearchValues = {
    destination: searchParams.get("keyword") || "",
    guests: parseInt(searchParams.get("guests")) || 2,
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
  };

  // Hàm xử lý khi người dùng bấm "Tìm kiếm" trong SearchBox
  // SearchBox sẽ trả về object params mới, ta chỉ cần update URL
  const handleSearch = (newParams) => {
      setSearchParams(newParams);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        // Scroll lên đầu
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Lấy lại data từ URL params (đảm bảo luôn đồng bộ với URL)
        const keyword = searchParams.get("keyword") || "";
        const guests = searchParams.get("guests") || 1;
        
        const data = await propertyService.searchProperties(keyword, guests);
        setHotels(data);
      } catch (error) {
        console.error("Failed to search hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

  return (
      <div className="min-h-screen bg-gray-50 pb-12">
        
        {/* === 1. STICKY HEADER VỚI SEARCH BOX ĐỒNG BỘ === */}
        <div className="bg-white border-b border-gray-200 sticky top-[64px] z-30 shadow-sm py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
             {/* Tái sử dụng SearchBox:
                - Truyền initialValues để nó hiện đúng thông tin đang tìm
                - Truyền onSearch để update URL thay vì navigate
                - Thêm className để custom lại shadow/border cho hợp ngữ cảnh header
             */}
             <SearchBox 
                initialValues={initialSearchValues}
                onSearch={handleSearch}
                className="shadow-none border-0 p-0 !gap-2" // Override style để gọn hơn trên header
             />
          </div>
        </div>

        {/* === 2. NỘI DUNG CHÍNH === */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-48"> {/* Top cao hơn chút do header search dày hơn */}
                <FilterSidebar />
              </div>
            </div>

            <div className="lg:col-span-3">
              <SearchResultsList 
                hotels={hotels} 
                loading={loading} 
                searchInfo={{ total: hotels.length, location: initialSearchValues.destination }} 
              />
            </div>

          </div>
        </div>
      </div>
  );
};

export default HotelSearchPage;