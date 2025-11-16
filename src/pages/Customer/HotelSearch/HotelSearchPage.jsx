// src/pages/Customer/HotelSearch/HotelSearchPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { addDays, parseISO, format } from "date-fns"; 
import Button from "@/components/common/Button/Button";
import { Search } from "lucide-react";

import DateSelector from "@/components/search/DateSelector";
import GuestSelector from "@/components/search/GuestSelector";
import DestinationSelector from "@/components/search/DestinationSelector"; 
import FilterSidebar from "./FilterSidebar";
import SearchResultsList from "./SearchResultsList";
import propertyService from "@/services/property.service"; // Import đã đúng

// --- Component Thanh Tìm Kiếm (Giữ nguyên) ---
const SearchBar = ({ searchParams, onParamsChange, onSearchClick, loading }) => {
  // ... (Code thanh tìm kiếm của bạn giữ nguyên) ...
  const handleChange = (key, value) => {
    onParamsChange(prev => ({ ...prev, [key]: value }));
  };

  return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl w-full">
        <DestinationSelector 
          value={searchParams.destination}
          onChange={(val) => handleChange('destination', val)}
        />
        <DateSelector 
          value={searchParams.dates}
          onChange={(val) => handleChange('dates', val)}
        />
        <GuestSelector 
          value={searchParams.guests}
          onChange={(val) => handleChange('guests', val)}
        />
        <div className="flex items-end justify-center">
          <Button
              size="lg"
              className="w-full bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white font-semibold shadow-md rounded-lg"
              onClick={onSearchClick}
              isLoading={loading}
              leftIcon={<Search size={18} />}
          >
            {loading ? "Đang tìm..." : "Tìm lại"}
          </Button>
        </div>
      </div>
  );
};

// --- Trang Tìm Kiếm Chính ---
export default function HotelSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State cho các ô input
  const [params, setParams] = useState(() => {
    const city = searchParams.get("city") || "";
//     const checkIn = searchParams.get("checkIn");
//     const checkOut = searchParams.get("checkOut");
//     const adults = parseInt(searchParams.get("adults") || "2", 10);
//     const children = parseInt(searchParams.get("children") || "0", 10);
//     const rooms = parseInt(searchParams.get("rooms") || "1", 10);

    return {
      destination: city,
//       dates: checkIn && checkOut ? {
//         startDate: parseISO(checkIn),
//         endDate: parseISO(checkOut)
//       } : {
//         startDate: new Date(),
//         endDate: addDays(new Date(), 1)
//      },
//       guests: { adults, children, rooms },
    };
  });

  // State cho kết quả API
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // State để hiển thị tiêu đề (chốt lại khi tìm)
  const [displayTerm, setDisplayTerm] = useState(searchParams.get("city") || "");

  // Hàm gọi API
  const handleSearch = useCallback(async (searchTerm) => {
    setLoading(true);
    setHasSearched(true);
    setHotels([]);
    
    setDisplayTerm(searchTerm);

    // API backend (PropertyRepository.java) chỉ nhận 'city' và 'keyword'
    const apiParams = {
      city: searchTerm,
      keyword: searchTerm, // Gửi cả 2 cho chắc
    };

    // Cập nhật URL (phần này code bạn đã đúng)
    const urlParams = new URLSearchParams();
    urlParams.append("city", searchTerm);
  //     urlParams.append("keyword", searchTerm);
//     urlParams.append("checkIn", format(params.dates.startDate, "yyyy-MM-dd"));
//     urlParams.append("checkOut", format(params.dates.endDate, "yyyy-MM-dd"));
//     urlParams.append("adults", params.guests.adults);
//     urlParams.append("children", params.guests.children);
//     urlParams.append("rooms", params.guests.rooms);
    setSearchParams(urlParams);
    
    try {
      // 'results' bây giờ là mảng [Property, Property, ...]
      const results = await propertyService.searchProperties(apiParams);

      // ✅ SỬA ĐỔI: Map dữ liệu thật từ API
      const formattedResults = results.map(prop => ({
        id: prop.propertyId, 
        name: prop.propertyName,  
        location: prop.city || prop.address,
        rating: prop.rating, // <-- Dữ liệu thật
        reviewCount: prop.reviewCount, // <-- Dữ liệu thật
        
        // Vẫn là dữ liệu giả, vì API /properties/search không trả về
        // (Property.java không có price, image)
        price: "2.200.000₫", 
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80"
      }));
      
      setHotels(formattedResults);
      
    } catch (err) {
      console.error("Search failed:", err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [params.dates, params.guests, setSearchParams]);

  // Tự động tìm kiếm khi tải trang (nếu có param)
  useEffect(() => {
    const initialCity = searchParams.get("city");
    if (initialCity) {
      handleSearch(initialCity);
    }
  }, [handleSearch]); // Thêm handleSearch vào dependency

  // Hàm riêng cho nút "Tìm lại"
  const onSearchClick = () => {
    handleSearch(params.destination);
  };

  return (
        <main className="max-w-7xl mx-auto px-6">
          <div className="sticky top-16 z-20 flex justify-center py-6 bg-gray-50 -mx-6 px-6 border-b border-gray-200">
            <SearchBar 
              searchParams={params}
              onParamsChange={setParams}
              onSearchClick={onSearchClick}
              loading={loading} 
            />
          </div>

          {/* ... (Phần render UI bên dưới giữ nguyên) ... */}
          <div className="w-full mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {hasSearched && (
                <div className="lg:col-span-1 sticky top-64 self-start">
                  <FilterSidebar />
                </div>
            )}
            <div className={hasSearched ? "lg:col-span-3" : "lg:col-span-4"}>
              {hasSearched && (
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {loading ? "Đang tìm kiếm..." : `Tìm thấy ${hotels.length} kết quả cho "${displayTerm}"`}
                  </h2>
              )}
              {hasSearched && <SearchResultsList loading={loading} hotels={hotels} />}
              {!hasSearched && (
                <div className="text-center py-20 text-gray-500">
                  <h2 className="text-xl font-semibold">Bắt đầu tìm kiếm</h2>
                  <p>Sử dụng thanh tìm kiếm bên trên để tìm khách sạn ưng ý.</p>
                </div>
              )}
            </div>
          </div>
        </main>
  );
}