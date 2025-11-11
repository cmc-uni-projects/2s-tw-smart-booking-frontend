import React from "react";
import Button from "@/components/common/Button/Button";
import DateSelector from "@/components/search/DateSelector";
import GuestSelector from "@/components/search/GuestSelector";
// 1. IMPORT COMPONENT MỚI
import DestinationSelector from "@/components/search/DestinationSelector";

const HeroSection = () => {
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

      {/* (Req #3) SỬA Z-INDEX TẠI ĐÂY
        Thay z-10 thành z-30 để cao hơn z-20 của FeaturedHotels
      */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-30">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#006494] mb-4">
          Đặt phòng dễ dàng cùng{" "}
          <span className="text-[rgb(40,169,224)]">TravelMate</span>
        </h1>
        <p className="text-gray-700 text-lg mb-10">
        </p>

        {/* Form tìm kiếm (relative để dropdowns định vị theo nó)
          Thêm z-index (ví dụ z-10) để đảm bảo nó ở trên các phần tử khác trong HeroSection
        */}
        <div className="relative z-10 bg-white shadow-xl rounded-2xl border border-gray-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl w-[90%]">
          
          {/* 2. THAY THẾ INPUT BẰNG COMPONENT MỚI */}
          <DestinationSelector />

          {/* Khoảng thời gian */}
          <DateSelector />

          {/* Số lượng */}
          <GuestSelector />

          {/* Nút tìm */}
          <div className="flex items-end justify-center">
            <Button
              size="lg"
              className="w-full bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white font-semibold shadow-md rounded-lg"
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