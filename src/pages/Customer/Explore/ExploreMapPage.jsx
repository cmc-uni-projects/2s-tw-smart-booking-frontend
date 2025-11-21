import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import propertyService from "@/services/property.service";

// Import các components con đã tách
import MapHotelCard from "./components/MapHotelCard";
import MapHeader from "./components/MapHeader";
import MapSearchHereButton from "./components/MapSearchHereButton";
import MapUserLocationButton from "./components/MapUserLocationButton";
import MapLoadingOverlay from "./components/MapLoadingOverlay";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Helper format giá
const formatShortPrice = (price) => {
  if (!price) return "Liên hệ";
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1).replace(/\.0$/, '') + "tr";
  }
  return (price / 1000).toFixed(0) + "k";
};

export default function ExploreMapPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const currentPopupRef = useRef(null);
  const navigate = useNavigate();

  // --- States ---
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [showSearchHereBtn, setShowSearchHereBtn] = useState(false);
  
  // Filter States
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState("all"); 

  // --- 1. Init Map ---
  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12", 
      center: [105.804817, 21.028511],
      zoom: 13,
      attributionControl: false,
      pitch: 0,
    });

    // Ẩn compass mặc định để dùng nút custom nếu muốn
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    map.current.on("load", () => {
      setIsLoading(false);
      getUserLocation();
    });

    map.current.on("moveend", () => {
       setShowSearchHereBtn(true);
    });

  }, []);

  // --- 2. Handle Filter Change ---
  useEffect(() => {
    if (properties.length > 0) {
        renderMarkers(properties);
    }
  }, [minRating, priceRange]);

  // --- 3. Map Actions ---
  const getUserLocation = () => {
    if (!navigator.geolocation) return;
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.current.flyTo({ center: [longitude, latitude], zoom: 14, essential: true });
        
        // Marker User (Chấm xanh)
        const el = document.createElement('div');
        el.innerHTML = `
            <div class="relative flex items-center justify-center w-8 h-8">
                <div class="w-4 h-4 bg-blue-600 border-[3px] border-white rounded-full shadow-lg z-10"></div>
                <div class="absolute w-full h-full bg-blue-400/30 rounded-full animate-ping"></div>
            </div>
        `;
        new mapboxgl.Marker({ element: el }).setLngLat([longitude, latitude]).addTo(map.current);

        fetchNearbyProperties(latitude, longitude);
      },
      () => fetchNearbyProperties(21.028511, 105.804817) // Fallback
    );
  };

  const handleSearchHere = () => {
    const center = map.current.getCenter();
    fetchNearbyProperties(center.lat, center.lng);
    setShowSearchHereBtn(false);
  };

  const fetchNearbyProperties = async (lat, lng) => {
    setIsLoading(true);
    try {
      const data = await propertyService.findNearbyProperties(lat, lng, 15);
      setProperties(data || []);
      renderMarkers(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. Render Markers (Price Tags) ---
  const renderMarkers = (data) => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!data || data.length === 0) return;

    // Filter Logic Client-side
    let filteredData = data.filter(p => (p.rating || 0) >= minRating);
    if (priceRange === 'low') filteredData = filteredData.filter(p => p.minPrice < 1000000);
    if (priceRange === 'mid') filteredData = filteredData.filter(p => p.minPrice >= 1000000 && p.minPrice < 3000000);
    if (priceRange === 'high') filteredData = filteredData.filter(p => p.minPrice >= 3000000);

    filteredData.forEach((hotel) => {
        const el = document.createElement("div");
        el.className = "price-marker cursor-pointer transition-all duration-200 hover:z-50 hover:scale-110";
        
        const priceText = formatShortPrice(hotel.minPrice);
        
        // UI Marker Giá
        el.innerHTML = `
            <div class="flex flex-col items-center">
                <div class="bg-white text-gray-800 font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-md border border-gray-200 whitespace-nowrap hover:bg-blue-600 hover:text-white transition-colors hover:border-blue-600">
                    ${priceText}
                </div>
                <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white shadow-sm -mt-[1px]"></div>
            </div>
        `;

        el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (currentPopupRef.current) currentPopupRef.current.remove();

            map.current.flyTo({ center: [hotel.longitude, hotel.latitude], zoom: 15, speed: 1.5, curve: 1 });

            // Render Popup React Component vào DOM node
            const popupNode = document.createElement("div");
            const root = createRoot(popupNode);
            
            root.render(
                <MapHotelCard 
                    property={hotel} 
                    navigate={navigate} 
                    onClose={() => currentPopupRef.current?.remove()} 
                />
            );

            const popup = new mapboxgl.Popup({
                offset: 15,
                closeButton: false,
                closeOnClick: true,
                maxWidth: 'none',
                className: 'modern-popup'
            })
            .setLngLat([hotel.longitude, hotel.latitude])
            .setDOMContent(popupNode)
            .addTo(map.current);

            currentPopupRef.current = popup;
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([hotel.longitude, hotel.latitude])
            .addTo(map.current);
        
        markersRef.current.push(marker);
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50 font-sans">
      
      {/* 1. Header & Filters */}
      <MapHeader 
        navigate={navigate}
        minRating={minRating}
        setMinRating={setMinRating}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {/* 2. Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* 3. Floating Buttons */}
      <MapSearchHereButton 
        visible={showSearchHereBtn && !isLoading} 
        onClick={handleSearchHere} 
      />

      <MapUserLocationButton 
        onClick={getUserLocation} 
      />

      {/* 4. Loading */}
      <MapLoadingOverlay isLoading={isLoading} />
      
      {/* Styles Global cho Popup của Mapbox */}
      <style>{`
        .modern-popup .mapboxgl-popup-content {
            padding: 0 !important;
            border-radius: 16px !important;
            background: transparent !important;
            box-shadow: none !important;
        }
        .modern-popup .mapboxgl-popup-tip {
            border-top-color: white !important;
            margin-bottom: -1px;
        }
        .mapboxgl-ctrl-logo { display: none !important; }
      `}</style>
    </div>
  );
}