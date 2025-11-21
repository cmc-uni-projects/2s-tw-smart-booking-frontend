import React from "react";
import { Search } from "lucide-react";

const MapSearchHereButton = ({ onClick, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute top-36 left-1/2 transform -translate-x-1/2 z-20">
      <button 
        onClick={onClick}
        className="bg-white text-blue-600 px-5 py-2 rounded-full shadow-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 border border-blue-100 transition-all animate-in fade-in slide-in-from-top-4"
      >
        <Search size={14} />
        Tìm ở khu vực này
      </button>
    </div>
  );
};

export default MapSearchHereButton;