import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Search, Crosshair, Move, Map as MapIcon } from "lucide-react";
import AdminSelectorsWithApi from "./components/AdminSelectorsWithApi"; 

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 

const PRIMARY_COLOR = "#3b82f6"; // Blue-500

// =========================
// COMPONENT INPUT ĐỒNG BỘ
// =========================
const StandardInput = React.forwardRef(({ label, error, icon, ...props }, ref) => (
  <div className="w-full space-y-1.5">
    {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
    <div className="relative">
      <input
        ref={ref}
        className={`
          w-full px-4 py-2.5 rounded-lg border bg-white text-sm text-slate-800
          transition-all duration-200 placeholder:text-slate-400 outline-none
          ${error 
            ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400" 
            : "border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm"
          }
          ${icon ? "pl-10" : ""}
        `}
        {...props}
      />
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {icon}
        </div>
      )}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
));

// =========================
// HEADER
// =========================
const LocationHeader = () => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center mb-6">
    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
      <MapIcon size={24} />
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-800">Vị trí chỗ nghỉ</h3>
      <p className="text-sm text-slate-500">
        Kéo thả ghim trên bản đồ để hệ thống tự động điền địa chỉ hành chính.
      </p>
    </div>
  </div>
);

// =========================
// MAIN COMPONENT
// =========================
const Step1_Location = ({ register, setValue, watch, errors }) => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const latWatch = watch("latitude");
  const lngWatch = watch("longitude");
  const currentCountry = watch("country");
  
  register("provinceCode"); 
  register("districtCode"); 
  register("ward"); 

  const [viewState, setViewState] = useState(() => ({
    lng: lngWatch ? Number(lngWatch) : 105.804817,
    lat: latWatch ? Number(latWatch) : 21.028511,
    zoom: 15,
  }));

  const [markerPosition, setMarkerPosition] = useState(() => ({
    lng: lngWatch ? Number(lngWatch) : 105.804817,
    lat: latWatch ? Number(latWatch) : 21.028511,
  }));

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mapboxData, setMapboxData] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // ----------------------------------------------------------
  // LOGIC PARSER V3 (GIỮ NGUYÊN)
  // ----------------------------------------------------------
  const extractLocationFromMapbox = (place) => {
    const context = place.context || [];
    const fullContext = [...context, { id: place.id, text: place.text }];
    const findByType = (type) => fullContext.find(c => c.id && c.id.startsWith(type))?.text;

    let country = findByType("country") || "Việt Nam";
    let province = findByType("region");
    let district = findByType("district");
    let ward = findByType("neighborhood") || findByType("locality");

    // 1. FIX TỈNH
    if (!province) {
         const placeText = findByType("place");
         const specialCities = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];
         if (placeText && specialCities.some(city => placeText.includes(city))) province = placeText;
    }

    // 2. FALLBACK CẮT CHUỖI
    if (place.place_name && province) {
        const parts = place.place_name.split(",").map(p => p.trim());
        const provinceIndex = parts.findIndex(p => p === province);
        
        if (provinceIndex > 0) {
            let potentialDistrict = parts[provinceIndex - 1];
            if (!isNaN(potentialDistrict)) {
                 if (provinceIndex > 1) potentialDistrict = parts[provinceIndex - 2];
            }
            
            if ((!district || district === province) && potentialDistrict) {
                district = potentialDistrict;
            }
            
            if (provinceIndex > 1) {
                 let potentialWardIndex = provinceIndex - 1;
                 if (!isNaN(parts[potentialWardIndex])) potentialWardIndex--; 
                 potentialWardIndex--; 
                 
                 if (potentialWardIndex >= 0) {
                     const potentialWard = parts[potentialWardIndex];
                     if (!ward && potentialWard && potentialWard !== district) {
                         ward = potentialWard;
                     }
                 }
            }
        }
    }
    
    if (district === province) district = undefined;
    if (ward === district) ward = undefined;

    console.log("🛠️ Parsed V3:", { province, district, ward });
    return { country, province, district, ward };
  };

  // --- REVERSE GEOCODE ---
  const reverseGeocode = async (lng, lat) => {
    try {
      const formattedLng = Number(lng).toFixed(6);
      const formattedLat = Number(lat).toFixed(6);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${formattedLng},${formattedLat}.json?access_token=${mapboxgl.accessToken}&language=vi&limit=1`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.features || data.features.length === 0) return;
      const place = data.features[0];

      const { country, province, district, ward } = extractLocationFromMapbox(place);

      setValue("address", place.place_name, { shouldValidate: true });
      setValue("country", country, { shouldValidate: true });
      
      setMapboxData({ province, district, ward, timestamp: Date.now() });

    } catch (err) { console.error(err); }
  };

  // --- INIT MAP ---
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12", 
      center: [viewState.lng, viewState.lat],
      zoom: viewState.zoom,
      attributionControl: false,
    });

    mapRef.current.on('load', () => setIsMapLoading(false));

    // Controls (ĐÃ BỎ GeolocateControl)
    mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current.addControl(new mapboxgl.ScaleControl(), "bottom-right");
    
    markerRef.current = new mapboxgl.Marker({ draggable: true, color: PRIMARY_COLOR, scale: 1.2 })
      .setLngLat([viewState.lng, viewState.lat])
      .addTo(mapRef.current);

    markerRef.current.on("dragend", async () => {
      const { lng, lat } = markerRef.current.getLngLat();
      setMarkerPosition({ lng, lat });
      setValue("latitude", lat); setValue("longitude", lng);
      await reverseGeocode(lng, lat);
    });

    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      markerRef.current?.setLngLat([lng, lat]);
      setMarkerPosition({ lng, lat });
      setValue("latitude", lat); setValue("longitude", lng);
      await reverseGeocode(lng, lat);
    });
  }, [mapRef]);

  useEffect(() => {
    if (markerRef.current && latWatch && lngWatch) {
        const lat = Number(latWatch); const lng = Number(lngWatch);
        if(!isNaN(lat) && !isNaN(lng)) {
            markerRef.current.setLngLat([lng, lat]);
            setMarkerPosition({ lng, lat });
            mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 });
        }
    }
  }, [latWatch, lngWatch]);

  // --- HANDLERS ---
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Trình duyệt không hỗ trợ định vị.");
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        markerRef.current?.setLngLat([longitude, latitude]);
        mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 15 });
        setMarkerPosition({ lng: longitude, lat: latitude });
        setValue("latitude", latitude); setValue("longitude", longitude);
        
        await reverseGeocode(longitude, latitude);
    }, () => alert("Không thể lấy vị trí."));
  };

  const handleSearchChange = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) { setSuggestions([]); return; }
    try {
      const { lng, lat } = viewState;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${mapboxgl.accessToken}&autocomplete=true&country=VN&language=vi&limit=5&proximity=${lng},${lat}`;
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (err) {}
  };

  const handleSelectSuggestion = async (place) => {
    const [lng, lat] = place.center;
    markerRef.current?.setLngLat([lng, lat]);
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 });
    setMarkerPosition({ lng, lat });
    setValue("latitude", lat); setValue("longitude", lng);
    
    const { country, province, district, ward } = extractLocationFromMapbox(place);
    setValue("address", place.place_name);
    setValue("country", country);
    setSearchQuery(place.place_name);
    setSuggestions([]);
    
    setMapboxData({ province, district, ward, timestamp: Date.now() });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <LocationHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ===== CỘT TRÁI: FORM NHẬP LIỆU ===== */}
        <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">
                    Khu vực hành chính
                </h4>
                
                {/* Component Select Dropdowns */}
                <AdminSelectorsWithApi 
                    watch={watch} setValue={setValue} errors={errors} 
                    mapRef={mapRef} markerRef={markerRef} mapboxData={mapboxData} 
                />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">
                    Chi tiết đường phố
                </h4>
                
                <StandardInput 
                    label="Địa chỉ cụ thể" 
                    placeholder="VD: Số 123 Đường ABC..."
                    {...register("address")} 
                    error={errors.address?.message} 
                    icon={<MapPin size={16} />}
                />
            </div>
        </div>

        {/* ===== CỘT PHẢI: BẢN ĐỒ ===== */}
        <div className="lg:col-span-7 order-1 lg:order-2 h-[550px] relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
            
            {/* 1. SEARCH BAR */}
            <div className="absolute top-4 left-4 right-4 z-20 max-w-lg">
                <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within/input:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-3 rounded-xl border-0 text-slate-900 placeholder:text-slate-400 
                        bg-white/90 backdrop-blur-md shadow-md ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                        placeholder="Tìm kiếm địa điểm, khách sạn..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    
                    {/* Dropdown Results */}
                    {suggestions.length > 0 && (
                    <ul className="absolute w-full bg-white/95 backdrop-blur-xl mt-2 rounded-xl shadow-xl max-h-[300px] overflow-auto py-2 text-sm border border-slate-100 animate-in fade-in slide-in-from-top-2">
                        {suggestions.map((item) => (
                        <li key={item.id} className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-start gap-3 text-slate-700 transition-colors border-b border-slate-50 last:border-0" onClick={() => handleSelectSuggestion(item)}>
                            <MapPin size={16} className="text-blue-500 mt-0.5 shrink-0" />
                            <div>
                                <span className="font-medium block text-slate-900">{item.text}</span>
                                <span className="text-xs text-slate-500 block mt-0.5 truncate max-w-[250px]">{item.place_name}</span>
                            </div>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>

            {/* 2. NÚT LẤY VỊ TRÍ (CUSTOM) */}
            <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="absolute top-[70px] left-4 z-10 bg-white/90 backdrop-blur p-2 pr-3 rounded-lg shadow-md border border-slate-100 text-slate-700 hover:text-blue-600 hover:bg-white transition-all active:scale-95 flex items-center gap-2 text-xs font-semibold"
            >
                <Crosshair size={18} className="text-blue-500" />
                Vị trí hiện tại
            </button>

            {/* 3. MAP */}
            <div ref={mapContainerRef} className="w-full h-full" />
            
            {isMapLoading && (
                <div className="absolute inset-0 bg-slate-50 z-0 flex items-center justify-center">
                     <span className="text-xs font-medium text-slate-500 animate-pulse">Đang tải bản đồ...</span>
                </div>
            )}

            {/* 4. COORDINATES PILL */}
            <div className="absolute bottom-8 left-4 right-12 z-10 pointer-events-none">
                 <div className="inline-flex bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-white/10 items-center gap-4 text-xs font-medium text-slate-300">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></span>
                        <span className="text-white font-mono">{markerPosition.lat.toFixed(5)}, {markerPosition.lng.toFixed(5)}</span>
                    </div>
                    <div className="w-px h-3 bg-white/20"></div>
                    <div className="flex items-center gap-1.5 text-blue-300">
                        <Move size={12}/> 
                        <span>Kéo thả ghim để chỉnh</span>
                    </div>
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Step1_Location;
