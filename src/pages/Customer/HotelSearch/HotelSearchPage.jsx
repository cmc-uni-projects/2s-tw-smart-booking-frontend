import React, { useState } from "react";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Button from "@/components/common/Button/Button";
import DateSelector from "@/components/search/DateSelector";
import GuestSelector from "@/components/search/GuestSelector";
import HotelCard from "@/components/common/Card/HotelCard";
import Spinner from "@/components/common/Loading/Spinner";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { Search } from "lucide-react";

// --- Dữ liệu giả (Mock Data) ---
// (Vì bạn chỉ làm frontend, chúng ta sẽ giả lập dữ liệu trả về)
const MOCK_HOTELS = [
  {
    id: 1,
    name: "The Ocean Resort",
    location: "Đà Nẵng",
    price: "2.200.000₫/đêm",
    image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/12/19/1128932/312606256_1243871556.jpg"
  },
  {
    id: 2,
    name: "Mountain Retreat",
    location: "Sapa",
    price: "1.700.000₫/đêm",
    image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a"
  },
  {
    id: 3,
    name: "Urban Stay",
    location: "Hà Nội",
    price: "1.500.000₫/đêm",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
  },
  {
    id: 4,
    name: "Hanoi Grand Hotel",
    location: "Hà Nội",
    price: "4.200.000₫/đêm",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
  },
];

// --- Component Thanh Tìm Kiếm (Tương tự HeroSection) ---
// Chúng ta đặt thanh tìm kiếm ngay trên trang kết quả
const SearchBar = ({ onSearchClick, loading }) => {
  // (Chúng ta có thể quản lý state của form ở đây,
  // nhưng để đơn giản, ta chỉ cần kích hoạt onSearchClick)

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

      {/* (Giá trị của DateSelector và GuestSelector chưa được liên kết
          với logic tìm kiếm, bạn có thể thêm state cho chúng sau) */}
      <DateSelector />
      <GuestSelector />

      <div className="flex items-end justify-center">
        <Button
          size="lg"
          className="w-full bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white font-semibold shadow-md rounded-lg"
          onClick={onSearchClick} // Kích hoạt hàm tìm kiếm
          isLoading={loading} // Hiển thị loading
          leftIcon={<Search size={18} />}
        >
          {loading ? "Đang tìm..." : "Tìm phòng"}
        </Button>
      </div>
    </div>
  );
};

// --- Component Hiển Thị Kết Quả ---
const SearchResults = ({ loading, hotels }) => {
  // 1. Trạng thái đang tải
  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner />
      </div>
    );
  }

  // 2. Không tìm thấy kết quả
  if (hotels.length === 0) {
    return (
      <div className="py-20">
        <EmptyState
          title="Không tìm thấy khách sạn"
          description="Vui lòng thử tìm kiếm với thông tin khác."
        />
      </div>
    );
  }

  // 3. Hiển thị danh sách
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((h) => (
        <HotelCard key={h.id} hotel={h} />
      ))}
    </div>
  );
};

// --- Trang Tìm Kiếm Chính ---
export default function HotelSearchPage() {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]); // Ban đầu là mảng rỗng
  const [hasSearched, setHasSearched] = useState(false); // Trạng thái để biết đã tìm kiếm chưa

  // Hàm xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    setLoading(true);
    setHasSearched(true); // Đánh dấu đã tìm kiếm
    setHotels([]); // Xóa kết quả cũ

    // Giả lập gọi API mất 1.5 giây
    setTimeout(() => {
      // (Sau này bạn sẽ thay bằng logic fetch API thật)

      // Ở đây ta sẽ trả về MOCK_HOTELS
      setHotels(MOCK_HOTELS);
      setLoading(false);
    }, 1500);
  };

  return (
    // Sử dụng Layout chung của Customer
    <CustomerLayout>
      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center">

        {/* 1. Thanh tìm kiếm */}
        <SearchBar onSearchClick={handleSearch} loading={loading} />

        <div className="w-full mt-12">
          {/* 2. Tiêu đề kết quả (chỉ hiện khi đã tìm kiếm) */}
          {hasSearched && (
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {loading ? "Đang tìm kiếm..." : `Tìm thấy ${hotels.length} kết quả`}
            </h2>
          )}

          {/* 3. Khu vực hiển thị kết quả */}
          {/* Chỉ hiển thị kết quả (loading, empty, or list) SAU KHI đã nhấn tìm kiếm */}
          {hasSearched && <SearchResults loading={loading} hotels={hotels} />}
        </div>

      </main>
    </CustomerLayout>
  );
}