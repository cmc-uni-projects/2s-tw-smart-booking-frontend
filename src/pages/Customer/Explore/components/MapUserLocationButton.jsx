import React from "react";
import { Navigation } from "lucide-react";

const MapUserLocationButton = ({ onClick }) => {
  return (
    <div className="absolute bottom-8 right-4 z-20 flex flex-col gap-3">
      <button 
        onClick={onClick} 
        className="p-3 bg-white rounded-full shadow-lg hover:bg-blue-50 text-blue-600 border border-gray-200 transition-transform active:scale-90" 
        title="Vị trí của tôi"
      >
        <Navigation size={24} />
      </button>
    </div>
  );
};

export default MapUserLocationButton;