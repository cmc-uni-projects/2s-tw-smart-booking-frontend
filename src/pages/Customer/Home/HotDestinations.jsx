import React from "react";
import Card from "@/components/common/Card/Card";

const HotDestinations = () => {
  const destinations = [
    {
      id: 1,
      name: "Đà Nẵng",
      image:
        "https://images.unsplash.com/photo-1603331242992-3a3f2e93b6ce?auto=format&fit=crop&w=900&q=80",
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
        "https://images.unsplash.com/photo-1542370285-b8eb8317691a?auto=format&fit=crop&w=900&q=80",
      hotels: 480,
    },
    {
      id: 4,
      name: "Đà Lạt",
      image:
        "https://images.unsplash.com/photo-1617704716324-0dcb7e4a6888?auto=format&fit=crop&w=900&q=80",
      hotels: 260,
    },
    {
      id: 5,
      name: "Hồ Chí Minh",
      image:
        "https://images.unsplash.com/photo-1596526131083-e8c633c948d3?auto=format&fit=crop&w=900&q=80",
      hotels: 510,
    },
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-b from-[#ffffff] to-[#f4fbff]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#006494] mb-3">
          Điểm đến nổi bật
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Khám phá những thành phố du lịch được yêu thích nhất tại Việt Nam 🌏
        </p>

        {/* Grid layout rõ ràng */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {destinations.map((item) => (
            <Card
              key={item.id}
              className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all bg-white"
            >
              {/* Hình ảnh điểm đến */}
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay nhẹ dưới để dễ đọc chữ */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-70 transition-all"></div>

                {/* Tên điểm đến */}
                <div className="absolute bottom-4 left-4 text-left">
                  <h3 className="text-xl font-bold text-white drop-shadow">
                    {item.name}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {item.hotels.toLocaleString("vi-VN")} khách sạn
                  </p>
                </div>
              </div>

              {/* Phần dưới card */}
              <div className="p-4 flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  <span className="text-[rgb(40,169,224)] font-semibold">
                    Ưu đãi hot
                  </span>{" "}
                  đang chờ bạn!
                </p>
                <button className="px-3 py-1 text-sm font-medium bg-[rgb(40,169,224)] text-white rounded-lg hover:bg-[#1b98d6] transition">
                  Xem ngay
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotDestinations;
