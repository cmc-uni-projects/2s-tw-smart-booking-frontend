import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2, Navigation, Search, ArrowLeft } from "lucide-react";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import propertyService from "@/services/property.service";
import MapHotelCard from "./components/MapHotelCard";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function ExploreMapPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]); 
  const currentPopupRef = useRef(null); 
  
  const navigate = useNavigate(); // ✅ Khởi tạo navigate ở đây (trong context Router)

  const [isLoading, setIsLoading] = useState(true);
  // ... states khác giữ nguyên

  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [105.804817, 21.028511],
      zoom: 13,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.current.on("load", () => {
      setIsLoading(false);
      getUserLocation(); 
    });
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.current.flyTo({ center: [longitude, latitude], zoom: 14 });
        
        // Marker User
        const el = document.createElement('div');
        el.className = 'user-marker';
        el.innerHTML = `<div class="relative flex items-center justify-center w-6 h-6"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-md"></span></div>`;
        new mapboxgl.Marker({ element: el }).setLngLat([longitude, latitude]).addTo(map.current);

        fetchNearbyProperties(latitude, longitude);
      },
      (err) => fetchNearbyProperties(21.028511, 105.804817)
    );
  };

  const fetchNearbyProperties = async (lat, lng) => {
    setIsLoading(true);
    try {
      const data = await propertyService.findNearbyProperties(lat, lng, 15); // Tăng radius lên 15km
      renderMarkers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMarkers = (data) => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!data || data.length === 0) return;

    data.forEach((hotel) => {
        const el = document.createElement("div");
        el.className = "hotel-marker group cursor-pointer transition-transform duration-200 hover:scale-110 hover:z-10";
        
        // HTML: Chấm vàng viền trắng
        el.innerHTML = `
            <div class="w-4 h-4 bg-yellow-400 border-2 border-white rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
        `;

        el.addEventListener("click", (e) => {
            e.stopPropagation();
            
            if (currentPopupRef.current) currentPopupRef.current.remove();

            map.current.flyTo({ center: [hotel.longitude, hotel.latitude], zoom: 15.5, speed: 1.5, curve: 1 });

            const popupNode = document.createElement("div");
            const root = createRoot(popupNode);
            
            // ✅ TRUYỀN NAVIGATE XUỐNG
            root.render(
                <MapHotelCard 
                    property={hotel} 
                    navigate={navigate} 
                    onClose={() => currentPopupRef.current?.remove()} 
                />
            );

            const popup = new mapboxgl.Popup({
                offset: 20,
                closeButton: false, // ❌ Tắt nút X của Mapbox (Dùng nút của Card)
                closeOnClick: true,
                maxWidth: 'none',   // Để Card tự quyết định width
                className: 'custom-mapbox-popup' // Có thể thêm CSS global để xóa padding mặc định
            })
            .setLngLat([hotel.longitude, hotel.latitude])
            .setDOMContent(popupNode)
            .addTo(map.current);

            currentPopupRef.current = popup;
        });

        const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([hotel.longitude, hotel.latitude])
            .addTo(map.current);
        
        markersRef.current.push(marker);
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Header Search */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-3 pointer-events-none">
         <button onClick={() => navigate(-1)} className="pointer-events-auto p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 text-gray-700">
            <ArrowLeft size={20} />
         </button>
         
         <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-full px-4 py-2 flex items-center gap-3 pointer-events-auto border border-gray-200 max-w-md w-full">
            <Search size={18} className="text-gray-400"/>
            <input type="text" placeholder="Tìm khu vực..." className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700 placeholder-gray-400" />
         </div>
         
         <button onClick={getUserLocation} className="pointer-events-auto p-2 bg-white rounded-full shadow-lg hover:bg-blue-50 text-blue-600">
            <Navigation size={20} />
         </button>
      </div>

      <div ref={mapContainer} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-blue-500 mb-2" size={40} />
            <span className="text-sm font-bold text-gray-700">Đang quét khách sạn...</span>
        </div>
      )}
      
      {/* CSS Global cho Popup (Thêm vào file index.css hoặc style tag) */}
      <style>{`
        .mapboxgl-popup-content {
            padding: 0 !important; /* Xóa padding trắng thừa */
            border-radius: 12px !important;
            background: transparent !important;
            box-shadow: none !important;
        }
        .mapboxgl-popup-tip {
            border-top-color: white !important;
        }
      `}</style>
    </div>
  );
}