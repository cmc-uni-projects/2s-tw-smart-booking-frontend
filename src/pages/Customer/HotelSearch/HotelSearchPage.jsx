// src/pages/Customer/HotelSearch/HotelSearchPage.jsx
import React, { useState } from "react";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Button from "@/components/common/Button/Button";
import DateSelector from "@/components/search/DateSelector";
import GuestSelector from "@/components/search/GuestSelector";
import { Search } from "lucide-react";

// +++ 1. IMPORT FILTER SIDEBAR +++
import FilterSidebar from "./FilterSidebar";
// +++ 2. IMPORT LIST KẾT QUẢ +++
import SearchResultsList from "./SearchResultsList";

// --- Dữ liệu giả (Mock Data) ---
const MOCK_HOTELS = [
  {
    id: 1,
    name: "The Ocean Resort",
    location: "Đà Nẵng",
    price: "2.200.000₫",
    image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/12/19/1128932/312606256_1243871556.jpg"
  },
  {
    id: 2,
    name: "Mountain Retreat",
    location: "Sapa",
    price: "1.700.000₫",
    image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a"
  },
  {
    id: 3,
    name: "Urban Stay",
    location: "Hà Nội",
    price: "1.500.000₫",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
  },
  {
    id: 4,
    name: "Hanoi Grand Hotel",
    location: "Hà Nội",
    price: "4.200.000₫",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
  },
];

// --- Component Thanh Tìm Kiếm (Giữ nguyên) ---
const SearchBar = ({ onSearchClick, loading }) => {
  return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl w-full">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Điểm đến
          </label>
          <input
              type="text"
              placeholder="Nhập thành phố hoặc khách sạn"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[rgb(40,169,224)] outline-none"
          />
        </div>
        <DateSelector />
        <GuestSelector />
        <div className="flex items-end justify-center">
          <Button
              size="lg"
              className="w-full bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white font-semibold shadow-md rounded-lg"
              onClick={onSearchClick}
              isLoading={loading}
              leftIcon={<Search size={18} />}
          >
            {loading ? "Đang tìm..." : "Tìm phòng"}
          </Button>
        </div>
      </div>
  );
};

// --- Trang Tìm Kiếm Chính ---
export default function HotelSearchPage() {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setHasSearched(true);
    setHotels([]);

    setTimeout(() => {
      setHotels(MOCK_HOTELS);
      setLoading(false);
    }, 1500);
  };

  return (
      <CustomerLayout>
        <main className="max-w-7xl mx-auto px-6">

          {/* ✅ Thanh tìm kiếm STICKY (dính vào top-16, tương ứng 64px) */}
          <div className="sticky top-16 z-20 flex justify-center py-6 bg-gray-50 -mx-6 px-6 border-b border-gray-200">
            <SearchBar onSearchClick={handleSearch} loading={loading} />
          </div>

          {/* Layout Grid 2 cột */}
          <div className="w-full mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ✅ Cột 1: Bộ lọc STICKY (ĐÃ CẬP NHẬT: top-64, tương ứng 16rem) */}
            {/* Giá trị 'top-64' này (16rem) sẽ khớp với chiều cao của Header (sticky top-0)
              cộng với chiều cao của thanh SearchBar (sticky top-16)
              và khoảng padding của nó, làm cho nó "dính" cố định ở vị trí mong muốn.
            */}
            {hasSearched && (
                <div className="lg:col-span-1 sticky top-64 self-start">
                  <FilterSidebar />
                </div>
            )}

            {/* ✅ Cột 2: List danh sách (sẽ cuộn) */}
            <div className={hasSearched ? "lg:col-span-3" : "lg:col-span-4"}>
              {/* Tiêu đề kết quả */}
              {hasSearched && (
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {loading ? "Đang tìm kiếm..." : `Tìm thấy ${hotels.length} kết quả`}
                  </h2>
              )}

              {/* List danh sách */}
              {hasSearched && <SearchResultsList loading={loading} hotels={hotels} />}
            </div>
          </div>

        </main>
      </CustomerLayout>
  );
}