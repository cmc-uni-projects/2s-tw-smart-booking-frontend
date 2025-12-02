// src/pages/Customer/Home/HotDestinations.jsx
import React from "react";
// ✅ Import component con mới
import DestinationCard from "@/components/common/Card/DestinationCard";

const HotDestinations = () => {
  const destinations = [
    {
      id: 1,
      name: "Đà Nẵng",
      image:
        "https://tourism.danang.vn/wp-content/uploads/2023/02/tour-du-lich-da-nang-1.jpg",
      hotels: 320,
    },
    {
      id: 2,
      name: "Phú Quốc",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
      hotels: 210,
    },
    {
      id: 3,
      name: "Hà Nội",
      image:
        "https://bvhttdl.mediacdn.vn/291773308735864832/2024/3/8/webdscf2302-1709868801363-1709868804633548541249.jpg",
      hotels: 480,
    },
    {
      id: 4,
      name: "Đà Lạt",
      image:
        "https://media.vneconomy.vn/images/upload/2023/07/06/1688465738-grasp-the-rainy-season-travel-tips-to-da-lat.jpg",
      hotels: 260,
    },
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-b from-[#ffffff] to-[#f4fbff]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#006494] mb-3">
          Điểm đến nổi bật
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Khám phá những thành phố du lịch được yêu thích nhất tại Việt Nam 
        </p>

        {/* ✅ Grid layout đã được dọn dẹp */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {destinations.map((item) => (
            // Gọi component con cho mỗi item
            <DestinationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotDestinations;