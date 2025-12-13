import React from "react";
import { ArrowRight, Calendar } from "lucide-react";

const ARTICLES = [
  {
    id: 1,
    category: "Cẩm nang",
    title: "Top 10 quán cafe view đẹp nhất Đà Lạt 2024",
    date: "12 Tháng 10, 2024",
    image: "https://images.unsplash.com/photo-1544965838-54ef8406f868?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    category: "Ẩm thực",
    title: "Food tour Hải Phòng: Ăn gì trong 24h?",
    date: "08 Tháng 10, 2024",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    category: "Khám phá",
    title: "Kinh nghiệm du lịch Phú Quốc tự túc cho gia đình",
    date: "05 Tháng 10, 2024",
    image: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?q=80&w=2094&auto=format&fit=crop"
  }
];

const TravelInspiration = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-10 px-2">
        <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Cảm hứng <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Xê Dịch</span>
            </h2>
            <p className="text-gray-500 mt-2">Tin tức, mẹo vặt và hướng dẫn du lịch mới nhất.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors">
            Xem tất cả bài viết <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ARTICLES.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-[1.5rem] mb-4 aspect-[4/3]">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 uppercase tracking-wider">
                {item.category}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <Calendar size={14} /> {item.date}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TravelInspiration;