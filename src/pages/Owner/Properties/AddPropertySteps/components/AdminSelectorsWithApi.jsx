// src/pages/Owner/Properties/AddPropertySteps/components/AdminSelectorsWithApi.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CustomSelect from "@/components/common/Select/CustomSelect";

// URL API địa danh Việt Nam (Frontend call)
const VN_API_BASE = "https://provinces.open-api.vn/api/";

const getMapboxAccessToken = () => import.meta.env.VITE_MAPBOX_TOKEN;

/**
 * Component chứa logic tải và hiển thị danh sách Tỉnh/Thành/Quận/Huyện từ API.
 * Đồng thời, nó sẽ sử dụng Mapbox Geocoding để cập nhật vị trí trên bản đồ.
 */
export default function AdminSelectorsWithApi({
  watch,
  setValue,
  errors,
  mapRef,       // Mapbox instance
  markerRef,    // Mapbox marker instance
}) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Lấy các giá trị code và tên từ form state (coerced to "" để tránh lỗi controlled/uncontrolled)
  const provinceCode = watch("provinceCode");
  const districtCode = watch("districtCode");
  const provinceName = watch("province") || ""; // FIX 1
  const districtName = watch("city") || ""; // FIX 1

  // --- CÁC HÀM XỬ LÝ API VÀ LOGIC MAPBOX ---

  // 1. Fetch Provinces
  const fetchProvinces = async () => {
    try {
      const response = await axios.get(`${VN_API_BASE}p/`);
      const options = response.data.map(p => ({
        value: p.code,
        label: p.name,
      }));
      setProvinces(options);
    } catch (e) {
      console.error("Failed to fetch provinces:", e);
    }
  };

  // 2. Geocoding & Map Centering (Chuyển tên địa danh thành tọa độ)
  const geocodeAndCenterMap = useCallback(async (address, depth) => {
    if (!address || !getMapboxAccessToken()) return;

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${getMapboxAccessToken()}&country=VN&limit=1`;

      const res = await fetch(url);
      const data = await res.json();
      const feature = data.features?.[0];

      if (feature && feature.center) {
        const [lng, lat] = feature.center;
        
        const zoomLevel = depth === 1 ? 9 : (depth === 2 ? 12 : 14); // Tùy chỉnh zoom

        // Di chuyển bản đồ và ghim
        mapRef.current?.flyTo({ center: [lng, lat], zoom: zoomLevel });
        markerRef.current?.setLngLat([lng, lat]);

        // Cập nhật tọa độ vào form (để lưu draft)
        setValue("latitude", lat, { shouldValidate: true });
        setValue("longitude", lng, { shouldValidate: true });
        
        // Cập nhật tên quốc gia (nếu API Geocoding trả về)
        const countryContext = feature.context?.find(c => c.id?.includes('country'))?.text || "Việt Nam";
        setValue("country", countryContext, { shouldValidate: true });
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
  }, [mapRef, markerRef, setValue]);

  // --- USE EFFECTS LỌC DỮ LIỆU ---

  // Tải danh sách tỉnh/thành khi component được mount
  useEffect(() => {
    fetchProvinces();
  }, []);
  
  // Tải danh sách quận/huyện khi Tỉnh/Thành thay đổi
  useEffect(() => {
    if (!provinceCode) {
      setDistricts([]);
      setValue("city", "", { shouldValidate: true });
      setValue("districtCode", "");
      return;
    }

    const fetchDistricts = async () => {
        try {
            // depth=2 để lấy danh sách Quận/Huyện
            const response = await axios.get(`${VN_API_BASE}p/${provinceCode}?depth=2`);
            const options = response.data.districts.map(d => ({
                value: d.code,
                label: d.name,
            }));
            setDistricts(options);
            setWards([]); // Reset Phường/Xã
        } catch (e) {
            console.error("Failed to fetch districts:", e);
        }
    };
    fetchDistricts();

    // Tự động Geocoding sau khi chọn Tỉnh
    if(provinceName) geocodeAndCenterMap(`${provinceName}, Việt Nam`, 1);

  }, [provinceCode, provinceName, geocodeAndCenterMap, setValue]); // FIX 2: Hoàn thiện dependency
  
  // Tải danh sách phường/xã khi Quận/Huyện thay đổi
  useEffect(() => {
    if (!districtCode) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
        try {
            // depth=2 để lấy danh sách Phường/Xã
            const response = await axios.get(`${VN_API_BASE}d/${districtCode}?depth=2`);
            const options = response.data.wards.map(w => ({
                value: w.code,
                label: w.name,
            }));
            setWards(options);
        } catch (e) {
            console.error("Failed to fetch wards:", e);
        }
    };
    fetchWards();

    // Tự động Geocoding sau khi chọn Quận/Huyện
    if(districtName) geocodeAndCenterMap(`${districtName}, ${provinceName}, Việt Nam`, 2);

  }, [districtCode, districtName, provinceName, geocodeAndCenterMap]); // FIX 2: Hoàn thiện dependency

  // --- CÁC HÀM HANDLE CHANGE ĐỂ CẬP NHẬT FORM ---

  const handleProvinceChange = (code, name) => {
    setValue("provinceCode", code);
    setValue("province", name, { shouldValidate: true });
    // Reset các cấp dưới
    setValue("districtCode", ""); 
    setValue("city", "", { shouldValidate: false }); 
    setValue("ward", "", { shouldValidate: false });
  };
  
  const handleDistrictChange = (code, name) => {
    setValue("districtCode", code);
    setValue("city", name, { shouldValidate: true }); // Lưu tên Quận/Huyện vào trường city
    // Reset cấp dưới
    setValue("ward", "", { shouldValidate: false });
  };

  const handleWardChange = (code, name) => {
    setValue("ward", name, { shouldValidate: true });
    // Geocoding lần cuối khi chọn Phường/Xã
    geocodeAndCenterMap(`${name}, ${districtName}, ${provinceName}, Việt Nam`, 3);
  };
  

  return (
    <>
      {/* Tỉnh / Thành phố */}
      <CustomSelect
        label="Tỉnh / Thành phố"
        options={provinces}
        value={provinceName}
        onChange={(name) => {
             const selected = provinces.find(p => p.label === name);
             handleProvinceChange(selected?.value, name);
        }}
        error={errors.province?.message}
        placeholder="Chọn Tỉnh/Thành phố"
      />

      {/* Quận / Huyện */}
      <CustomSelect
        label="Quận / Huyện"
        options={districts}
        value={districtName}
        onChange={(name) => {
            const selected = districts.find(d => d.label === name);
            handleDistrictChange(selected?.value, name);
        }}
        error={errors.city?.message}
        disabled={!provinceCode || districts.length === 0}
        placeholder="Chọn Quận/Huyện"
      />

      {/* Phường / Xã */}
      <CustomSelect
        label="Phường / Xã"
        options={wards}
        value={watch("ward") || ""} // FIX 1
        onChange={(name) => handleWardChange(null, name)} // Không lưu code Phường/Xã
        error={errors.ward?.message}
        disabled={!districtCode || wards.length === 0}
        placeholder="Chọn Phường/Xã"
      />
    </>
  );
}