import React from "react";
import { ArrowLeft, Search, Calendar, User, Filter } from "lucide-react";

const MapHeader = ({ 
  navigate, 
  minRating, 
  setMinRating, 
  priceRange, 
  setPriceRange 
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none flex flex-col gap-3">
      
      {/* --- Top Bar: Back + Search Box --- */}
      <div className="flex items-center justify-center gap-3 pointer-events-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-white rounded-full shadow-xl hover:bg-gray-50 text-gray-700 border border-gray-100 transition-transform active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Search Bar mô phỏng */}
        <div className="bg-white shadow-xl rounded-full p-1.5 flex items-center border border-gray-200 max-w-2xl w-full transition-shadow hover:shadow-2xl">
          <div className="flex-1 flex items-center px-4 border-r border-gray-200 gap-2">
            <Search size={18} className="text-blue-500" />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Địa điểm</span>
              <input 
                type="text" 
                placeholder="Bạn muốn đi đâu?" 
                className="text-sm font-medium text-gray-800 placeholder-gray-400 outline-none bg-transparent w-full" 
              />
            </div>
          </div>
          
          <div className="hidden md:flex flex-1 items-center px-4 border-r border-gray-200 gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
            <Calendar size={18} className="text-blue-500" />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nhận phòng</span>
              <span className="text-sm font-medium text-gray-700">Thêm ngày</span>
            </div>
          </div>

          <div className="hidden md:flex w-32 items-center px-4 gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
            <User size={18} className="text-blue-500" />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Số khách</span>
              <span className="text-sm font-medium text-gray-700">1 khách</span>
            </div>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md transition-transform active:scale-95">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* --- Filter Chips --- */}
      <div className="flex items-center justify-center gap-2 pointer-events-auto overflow-x-auto no-scrollbar pb-2">
        <button 
          onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
          className={`px-4 py-2 rounded-full text-sm font-medium shadow-md border transition-all flex items-center gap-2 ${
            minRating === 4 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Filter size={14} />
          4 sao trở lên
        </button>

        <button 
          onClick={() => setPriceRange(priceRange === 'low' ? 'all' : 'low')}
          className={`px-4 py-2 rounded-full text-sm font-medium shadow-md border transition-all ${
            priceRange === 'low' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Dưới 1 triệu
        </button>

        <button 
          onClick={() => setPriceRange(priceRange === 'mid' ? 'all' : 'mid')}
          className={`px-4 py-2 rounded-full text-sm font-medium shadow-md border transition-all ${
            priceRange === 'mid' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          1 - 3 triệu
        </button>
      </div>
    </div>
  );
};

export default MapHeader;