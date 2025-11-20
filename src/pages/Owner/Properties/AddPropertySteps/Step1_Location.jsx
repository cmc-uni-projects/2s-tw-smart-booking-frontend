// src/pages/Owner/Properties/AddPropertySteps/Step1_Location.jsx

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import CustomSelect from "@/components/common/Select/CustomSelect";
import AdminSelectorsWithApi from "./components/AdminSelectorsWithApi"; 

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Đã sửa lỗi import CSS

const PRIMARY_COLOR = "rgb(40,169,224)";

// ... (Các component con LocationHeader, MapSearchBox, CoordinatesDisplay giữ nguyên)

const LocationHeader = () => (
  <div className="bg-[rgb(240,249,255)] p-4 rounded-xl border border-[rgb(221,238,255)] flex gap-3 items-start">
    <div className="p-2 bg-white rounded-lg shadow-sm text-[rgb(40,169,224)]">
      <MapPin size={24} />
    </div>
    <div>
      <h3 className="font-bold text-[rgb(15,76,117)]">Vị trí chỗ nghỉ</h3>
      <p className="text-sm text-[rgb(46,116,181)] mt-1">
        Tìm kiếm hoặc kéo ghim trên bản đồ để chọn vị trí chính xác của cơ sở
        lưu trú, giống như Traveloka / Booking.
      </p>
    </div>
  </div>
);

const MapSearchBox = ({
  searchQuery,
  onSearchChange,
  suggestions,
  onSelectSuggestion,
}) => (
  <div className="relative mb-3">
    <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[rgb(40,169,224)] focus-within:border-[rgb(40,169,224)] transition">
      <Search size={16} className="text-gray-400" />
      <input
        type="text"
        placeholder="Tìm địa chỉ, khách sạn, địa danh..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full text-sm outline-none"
      />
    </div>

    {suggestions.length > 0 && (
      <ul className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl max-h-60 overflow-auto text-sm">
        {suggestions.map((item) => (
          <li
            key={item.id}
            className="px-3 py-2 cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectSuggestion(item)}
          >
            {item.place_name}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const CoordinatesDisplay = ({ lat, lng }) => (
  <div className="flex gap-6 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200 justify-center items-center">
    <div className="flex flex-col items-center">
      <span className="uppercase font-bold text-[10px] tracking-wider text-gray-400">
        Latitude
      </span>
      <span className="font-mono font-bold text-gray-800 text-sm">
        {lat?.toFixed(6)}
      </span>
    </div>
    <div className="w-px h-6 bg-gray-300"></div>
    <div className="flex flex-col items-center">
      <span className="uppercase font-bold text-[10px] tracking-wider text-gray-400">
        Longitude
      </span>
      <span className="font-mono font-bold text-gray-800 text-sm">
        {lng?.toFixed(6)}
      </span>
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
  
  // [NEW] Register hidden fields for codes
  register("provinceCode"); 
  register("districtCode"); 
  // [NEW] Register the new field for ward (tên phường/xã)
  register("ward"); 

  const [viewState, setViewState] = useState(() => ({
    lng: lngWatch ? Number(lngWatch) : 105.804817,
    lat: latWatch ? Number(latWatch) : 21.028511,
    zoom: 14,
  }));

  const [markerPosition, setMarkerPosition] = useState(() => ({
    lng: lngWatch ? Number(lngWatch) : 105.804817,
    lat: latWatch ? Number(latWatch) : 21.028511,
  }));

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // =========================
  // REVERSE GEOCODE (ĐI TỪ TOẠ ĐỘ → ĐỊA CHỈ) - Giữ nguyên
  // =========================
  const reverseGeocode = async (lng, lat) => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${
        mapboxgl.accessToken
      }&language=vi&types=address,street,place,locality,neighborhood,region&country=VN&limit=1`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.features || data.features.length === 0) return;

      const place = data.features[0];
      const ctx = place.context || [];

      const getById = (keyword) =>
        ctx.find((c) => c.id && c.id.includes(keyword));

      const country = getById("country")?.text || "Việt Nam";
      const region = getById("region")?.text; 
      const city =
        getById("place")?.text ||
        getById("locality")?.text ||
        region ||
        "";
      const district =
        getById("district")?.text || getById("locality")?.text || "";
      const ward =
        getById("neighborhood")?.text ||
        ctx.find((c) => c.id?.includes("ward"))?.text ||
        "";

      setValue("address", place.place_name, { shouldValidate: true });
      // [UPDATE] Cập nhật các trường tên và code
      if (region) setValue("province", region, { shouldValidate: true });
      if (city) setValue("city", city, { shouldValidate: true });
      if (district) setValue("ward", district, { shouldValidate: true }); 
      setValue("country", country, { shouldValidate: true });
      
      // [NEW] Cần clear mã code (provinceCode/districtCode) nếu người dùng thả ghim.
      setValue("provinceCode", "");
      setValue("districtCode", "");

    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  // ... (Phần INIT MAP giữ nguyên logic) ...
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [viewState.lng, viewState.lat],
      zoom: viewState.zoom,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current.addControl(new mapboxgl.ScaleControl(), "bottom-right");
    mapRef.current.addControl(
      new mapboxgl.GeolocateControl({
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    // Marker kéo thả
    markerRef.current = new mapboxgl.Marker({
      draggable: true,
      color: PRIMARY_COLOR,
    })
      .setLngLat([viewState.lng, viewState.lat])
      .addTo(mapRef.current);

    markerRef.current.on("dragend", async () => {
      const lngLat = markerRef.current.getLngLat();
      setMarkerPosition({ lng: lngLat.lng, lat: lngLat.lat });

      setValue("latitude", lngLat.lat, { shouldValidate: true });
      setValue("longitude", lngLat.lng, { shouldValidate: true });

      setViewState((prev) => ({
        ...prev,
        lat: lngLat.lat,
        lng: lngLat.lng,
      }));

      await reverseGeocode(lngLat.lng, lngLat.lat);
    });

    // Click map → snap vào địa chỉ gần nhất
    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      markerRef.current?.setLngLat([lng, lat]);
      setMarkerPosition({ lng, lat });

      setValue("latitude", lat, { shouldValidate: true });
      setValue("longitude", lng, { shouldValidate: true });

      await reverseGeocode(lng, lat);
    });

    mapRef.current.on("move", () => {
      const center = mapRef.current.getCenter();
      setViewState((prev) => ({
        ...prev,
        lng: center.lng,
        lat: center.lat,
        zoom: mapRef.current.getZoom(),
      }));
    });
  }, [mapRef]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Đồng bộ nếu form có lat/lng từ trước (VD load draft)
  useEffect(() => {
    if (
      markerRef.current &&
      latWatch &&
      lngWatch &&
      !Number.isNaN(Number(latWatch)) &&
      !Number.isNaN(Number(lngWatch))
    ) {
      const lat = Number(latWatch);
      const lng = Number(lngWatch);
      markerRef.current.setLngLat([lng, lat]);
      setMarkerPosition({ lng, lat });
      mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 });
    }
  }, [latWatch, lngWatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // ... (GEOLOCATION BUTTON và SEARCH/AUTOCOMPLETE giữ nguyên) ...
  const handleGetCurrentLocation = () => {
    // ... (logic giữ nguyên)
    if (!navigator.geolocation) {
      return alert("Trình duyệt không hỗ trợ định vị.");
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        markerRef.current?.setLngLat([longitude, latitude]);
        mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 15 });

        setMarkerPosition({ lng: longitude, lat: latitude });

        setValue("latitude", latitude, { shouldValidate: true });
        setValue("longitude", longitude, { shouldValidate: true });

        await reverseGeocode(longitude, latitude);
      },
      () => alert("Không thể lấy vị trí của bạn.")
    );
  };
  
  const handleSearchChange = async (value) => {
    setSearchQuery(value);
    
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const { lng, lat } = viewState;

      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        value
      )}.json?access_token=${
        mapboxgl.accessToken
      }&autocomplete=true&country=VN&language=vi&limit=5&types=address,street,place,locality&bbox=102.14441,8.179066,109.469,23.392&proximity=${lng},${lat}`;

      const res = await fetch(url);
      const data = await res.json();

      setSuggestions(data.features || []);
    } catch (err) {
      console.error("Search geocoding error:", err);
    }
  };

  const handleSelectSuggestion = async (place) => {
    const [lng, lat] = place.center;

    markerRef.current?.setLngLat([lng, lat]);
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 });

    setMarkerPosition({ lng, lat });

    setValue("latitude", lat, { shouldValidate: true });
    setValue("longitude", lng, { shouldValidate: true });
    setValue("address", place.place_name, { shouldValidate: true });

    const ctx = place.context || [];
    const getById = (keyword) =>
      ctx.find((c) => c.id && c.id.includes(keyword));

    const country = getById("country")?.text || "Việt Nam";
    const region = getById("region")?.text;
    const city =
      getById("place")?.text ||
      getById("locality")?.text ||
      region ||
      "";
    const district =
      getById("district")?.text || getById("locality")?.text || "";
    const ward =
      getById("neighborhood")?.text ||
      ctx.find((c) => c.id?.includes("ward"))?.text ||
      "";

    // [UPDATE] Cập nhật các trường tên (Province/City/Ward)
    if (region) setValue("province", region, { shouldValidate: true });
    if (city) setValue("city", city, { shouldValidate: true });
    if (district) setValue("ward", district, { shouldValidate: true });
    
    // [NEW] Clear mã code khi dùng search Mapbox
    setValue("provinceCode", "");
    setValue("districtCode", "");
    
    setValue("country", country, { shouldValidate: true });

    setSearchQuery(place.place_name);
    setSuggestions([]);
  };


  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6 animate-fadeIn">
      <LocationHeader />

      {/* FORM BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FloatingTextField
            label="Địa chỉ chi tiết"
            {...register("address")}
            error={errors.address?.message}
            required
          />
        </div>

        {/* [NEW] TỈNH/THÀNH - QUẬN/HUYỆN - PHƯỜNG/XÃ (Dùng component mới) */}
        <AdminSelectorsWithApi 
            watch={watch} 
            setValue={setValue} 
            errors={errors} 
            mapRef={mapRef} 
            markerRef={markerRef} 
        />

        <FloatingTextField
          label="Quốc gia"
          value={currentCountry || "Việt Nam"}
          readOnly
          disabled
        />
      </div>

      {/* MAP + SEARCH */}
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Ghim vị trí trên bản đồ
          </label>
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            className="text-xs flex items-center gap-1 font-medium transition-colors px-3 py-1.5 rounded-full border border-[rgb(40,169,224)] text-[rgb(40,169,224)] hover:bg-[rgb(40,169,224)] hover:text-white shadow-sm"
          >
            <Navigation size={14} /> Lấy vị trí hiện tại
          </button>
        </div>

        <MapSearchBox
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          suggestions={suggestions}
          onSelectSuggestion={handleSelectSuggestion}
        />

        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-300 shadow-[0_10px_30px_rgba(15,23,42,0.1)] relative bg-gray-100">
          <div ref={mapContainerRef} className="w-full h-full" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/70 to-transparent" />
        </div>

        <CoordinatesDisplay
          lat={markerPosition.lat}
          lng={markerPosition.lng}
        />
      </div>
    </div>
  );
};

export default Step1_Location;
