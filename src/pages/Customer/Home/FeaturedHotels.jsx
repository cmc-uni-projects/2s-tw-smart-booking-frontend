// src/pages/Customer/Home/FeaturedHotels.jsx
import React from "react";
import Button from "@/components/common/Button/Button";
import HotelCard from "@/components/common/Card/HotelCard"; 
import { Hotel } from "lucide-react";

const FeaturedHotels = () => {
  // Dữ liệu 8 khách sạn (giữ nguyên như lần trước)
  const hotels = [
    { 
      id: 1, 
      name: "The Ocean Resort", 
      location: "Đà Nẵng", 
      price: "2.200.000₫/đêm", 
      image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/12/19/1128932/312606256_1243871556.jpg",
      rating: 9.2,
      reviews: 1480
    },
    { 
      id: 2, 
      name: "Mountain Retreat", 
      location: "Sapa", 
      price: "1.700.000₫/đêm", 
      image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a",
      rating: 9.0,
      reviews: 990
    },
    { 
      id: 3, 
      name: "Hanoi La Siesta Hotel", 
      location: "Hà Nội", 
      price: "1.900.000₫/đêm", 
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      rating: 9.5,
      reviews: 2100
    },
    { 
      id: 4, 
      name: "InterContinental Saigon", 
      location: "Hồ Chí Minh", 
      price: "3.500.000₫/đêm", 
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      rating: 9.3,
      reviews: 1850
    },
    { 
      id: 5, 
      name: "Ana Mandara Villas Dalat", 
      location: "Đà Lạt", 
      price: "2.800.000₫/đêm", 
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      rating: 9.1,
      reviews: 1200
    },
    { 
      id: 6, 
      name: "Fusion Resort Phu Quoc", 
      location: "Phú Quốc", 
      price: "4.100.000₫/đêm", 
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      rating: 9.4,
      reviews: 1670
    },
    { 
      id: 7, 
      name: "Topas Ecolodge", 
      location: "Lào Cai", 
      price: "5.500.000₫/đêm", 
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      rating: 9.8,
      reviews: 850
    },
    { 
      id: 8, 
      name: "The Reverie Saigon", 
      location: "Hồ Chí Minh", 
      price: "6.200.000₫/đêm", 
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      rating: 9.6,
      reviews: 1300
    },
  ];

  return (
    // ✅ (Yêu cầu) Sửa -mt-24 (âm 6rem) thành -mt-16 (âm 4rem)
    <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
      <div className="flex justify-between items-center mb-6">
        
        {/* Tiêu đề nổi bật (giữ nguyên) */}
        <div className="flex items-center gap-3">
          <Hotel size={32} className="text-[#006494]" />
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#006494] to-[rgb(40,169,224)]">
            Khách sạn nổi bật trên TravelMate
          </h2>
        </div>

        <Button variant="outline">Xem tất cả</Button>
      </div>

      {/* Grid 4 cột (giữ nguyên) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotels.map((h) => (
          <HotelCard key={h.id} hotel={h} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedHotels;