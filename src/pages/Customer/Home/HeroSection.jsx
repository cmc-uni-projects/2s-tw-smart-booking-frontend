import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { addDays, format } from "date-fns";
import Button from "@/components/common/Button/Button";
import DateSelector from "@/components/search/DateSelector";
import GuestSelector from "@/components/search/GuestSelector";
import DestinationSelector from "@/components/search/DestinationSelector";

const HeroSection = () => {
  const navigate = useNavigate();

  const [destination, setDestination] = useState(""); // Đây là "keyword"
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
  });
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
  });

  // ✅ CẬP NHẬT HÀM TÌM KIẾM
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    // 1. Input người dùng (Destination/Keyword)
    // Nếu không nhập gì, backend sẽ trả về tất cả
    if (destination) {
      params.append("keyword", destination); 
    }

    // 2. Số lượng khách (Tổng người lớn + trẻ em)
    const totalGuests = guests.adults + guests.children;
    params.append("guests", totalGuests);

    // (Các tham số khác giữ nguyên để dùng cho trang lọc sau này)
    params.append("checkIn", format(dates.startDate, "yyyy-MM-dd"));
    params.append("checkOut", format(dates.endDate, "yyyy-MM-dd"));
    params.append("rooms", guests.rooms);
    
    // Điều hướng sang trang danh sách
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-white to-[#f4fbff] pb-24">
      {/* Ảnh nền */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src="https://ik.imagekit.io/tvlk/image/imageResource/2025/10/09/1760028631175-baba0063c39e11156f32f14ef2e77e9f.png?tr=q-75%201x,%20https://ik.imagekit.io/tvlk/image/imageResource/2025/10/09/1760028631175-baba0063c39e11156f32f14ef2e77e9f.png?tr=dpr-2,q-75%202x,%20https://ik.imagekit.io/tvlk/image/imageResource/2025/10/09/1760028631175-baba0063c39e11156f32f14ef2e77e9f.png?tr=dpr-3,q-75%203x"
          alt="Travel background"
          className="absolute inset-0 w-full h-full object-cover brightness-[1.05]"
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-30">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#006494] mb-4">
          Đặt phòng dễ dàng cùng{" "}
          <span className="text-[rgb(40,169,224)]">TravelMate</span>
        </h1>
        <p className="text-gray-700 text-lg mb-10">
        </p>

        <div className="relative z-10 bg-white shadow-xl rounded-2xl border border-gray-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl w-[90%]">
          
          <DestinationSelector
            value={destination}
            onChange={setDestination}
          />
          <DateSelector 
            value={dates} 
            onChange={setDates} 
          />
          <GuestSelector 
            value={guests} 
            onChange={setGuests} 
          />

          <div className="flex items-end justify-center">
            <Button
              size="lg"
              className="w-full bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white font-semibold shadow-md rounded-lg"
              onClick={handleSearch}
              leftIcon={<Search size={18} />}
            >
              Tìm phòng
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;