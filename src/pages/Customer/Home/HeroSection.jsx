import React from "react";
// 1. Import useNavigate và Search
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import Button from "@/components/common/Button/Button";
import DateSelector from "@/components/search/DateSelector";
import GuestSelector from "@/components/search/GuestSelector";
import DestinationSelector from "@/components/search/DestinationSelector";

const HeroSection = () => {
  // 2. Khởi tạo hook
  const navigate = useNavigate();

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

      {/* Sửa z-index (từ 10 lên 30) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-30">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#006494] mb-4">
          Đặt phòng dễ dàng cùng{" "}
          <span className="text-[rgb(40,169,224)]">TravelMate</span>
        </h1>
        <p className="text-gray-700 text-lg mb-10">
        </p>

        <div className="relative z-10 bg-white shadow-xl rounded-2xl border border-gray-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl w-[90%]">
          
          <DestinationSelector />
          <DateSelector />
          <GuestSelector />

          {/* 3. Cập nhật Nút tìm */}
          <div className="flex items-end justify-center">
            <Button
              size="lg"
              className="w-full bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white font-semibold shadow-md rounded-lg"
              // (Req #2) Thêm onClick để chuyển trang
              onClick={() => navigate("/hotels")}
              // (Req #1) Thêm icon Search
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