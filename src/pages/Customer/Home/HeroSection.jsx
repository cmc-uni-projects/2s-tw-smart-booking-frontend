import React from "react";
import SearchBox from "@/components/search/SearchBox";
// ✅ 1. Import ảnh từ thư mục assets
// Lưu ý: Đảm bảo bạn đã tạo thư mục 'herosection' trong 'src/assets' và copy ảnh vào đó
import heroBgImage from "@/assets/herosection/herosection.jpeg"; 

const HeroSection = () => {
  return (
    <section className="relative w-full bg-gradient-to-b from-white to-[#f4fbff] pb-24">
      {/* Ảnh nền */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={heroBgImage}
          alt="Travel background"
          className="absolute inset-0 w-full h-full object-cover brightness-[1.05]"
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-30">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#006494] mb-4 drop-shadow-sm">
          Đặt phòng dễ dàng cùng{" "}
          <span className="text-[rgb(40,169,224)]">TravelMate</span>
        </h1>
        <p className="text-gray-700 text-lg mb-10 font-medium">
        </p>

        <div className="w-full max-w-6xl px-4">
           <SearchBox />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;