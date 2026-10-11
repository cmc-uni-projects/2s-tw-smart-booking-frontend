// src/pages/Owner/Properties/AddPropertySteps/components/AdminSelectorsWithApi.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomSelect from "@/components/common/Select/CustomSelect";
import { useTranslation } from "react-i18next";

const VN_API_BASE = "https://provinces.open-api.vn/api/";
const getMapboxAccessToken = () => import.meta.env.VITE_MAPBOX_TOKEN;

// Hàm chuẩn hóa tên
const normalizeName = (str) => {
  if (!str) return "";
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/(tỉnh|thành phố|quận|huyện|thị xã|phường|xã|thị trấn)/g, "").replace(/[^a-z0-9]/g, "").trim(); // i18n-ignore (normalises Vietnamese place names)
};

export default function AdminSelectorsWithApi({ watch, setValue, errors, mapRef, markerRef, mapboxData }) {
  const { t } = useTranslation();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const provinceCode = watch("provinceCode");
  const districtCode = watch("districtCode");
  const wardName = watch("ward");

  // Debug: Báo khi component được mount
  useEffect(() => { console.log("Component AdminSelectorsWithApi mounted"); }, []);

  // 1. Load Tỉnh
  useEffect(() => {
    console.log("🚀 Loading provinces...");
    axios.get(`${VN_API_BASE}p/`)
      .then(res => {
        console.log(`✅ Loaded ${res.data.length} provinces/cities.`);
        setProvinces(res.data.map(p => ({ value: p.code, label: p.name })));
      })
      .catch(err => console.error("🔥 Failed to load provinces:", err));
  }, []);

  // 2. LOGIC ĐỒNG BỘ TỪ MAPBOX
  useEffect(() => {
    // Log kiểm tra đầu vào
    if (!mapboxData) return; 
    console.log("📩 AdminSelectors received MapboxData:", mapboxData);

    if (provinces.length === 0) {
        console.warn("⏳ Waiting for provinces to load...");
        return;
    }

    const { province: mProvince, district: mDistrict, ward: mWard } = mapboxData;
    
    if (!mProvince) {
        console.warn("⚠️ Mapbox did not return a province (region) name. Data received:", mapboxData);
        return;
    }

    const syncLogic = async () => {
      console.log("🔄 Syncing location...");
      setIsSyncing(true);
      try {
        // Match Tỉnh
        const normProvince = normalizeName(mProvince);
        const foundProvince = provinces.find(p => normalizeName(p.label).includes(normProvince) || normProvince.includes(normalizeName(p.label)));
        
        if (!foundProvince) {
             console.error(`❌ No province matches "${mProvince}" (Norm: ${normProvince})`);
             setIsSyncing(false);
             return;
        }
        console.log("📍 Province selected:", foundProvince.label);
        setValue("provinceCode", foundProvince.value);
        setValue("province", foundProvince.label, { shouldValidate: true });

        // Load Huyện
        console.log(`⬇️ Loading districts for province ${foundProvince.label} (Code: ${foundProvince.value})...`);
        const resD = await axios.get(`${VN_API_BASE}p/${foundProvince.value}?depth=2`);
        const dOptions = resD.data.districts.map(d => ({ value: d.code, label: d.name }));
        setDistricts(dOptions);

        // Match Huyện
        if (mDistrict) {
            const normDistrict = normalizeName(mDistrict);
            const foundDistrict = dOptions.find(d => normalizeName(d.label).includes(normDistrict) || normDistrict.includes(normalizeName(d.label)));
            
            if (foundDistrict) {
                console.log("📍 District selected:", foundDistrict.label);
                setValue("districtCode", foundDistrict.value);
                setValue("city", foundDistrict.label, { shouldValidate: true });

                // Load Xã
                console.log(`⬇️ Loading wards for district ${foundDistrict.label}...`);
                const resW = await axios.get(`${VN_API_BASE}d/${foundDistrict.value}?depth=2`);
                const wOptions = resW.data.wards.map(w => ({ value: w.name, label: w.name }));
                setWards(wOptions);

                // Match Xã
                if (mWard) {
                    const normWard = normalizeName(mWard);
                    const foundWard = wOptions.find(w => normalizeName(w.label).includes(normWard) || normWard.includes(normalizeName(w.label)));
                    if (foundWard) {
                        console.log("📍 Ward selected:", foundWard.label);
                        setValue("ward", foundWard.label, { shouldValidate: true });
                    } else {
                        console.warn(`⚠️ No ward matches "${mWard}", filling in temporarily.`);
                        setValue("ward", mWard, { shouldValidate: true });
                    }
                }
            } else {
                console.warn(`❌ No district matches "${mDistrict}"`);
            }
        }
      } catch (err) { 
        console.error("🔥 Error while syncing:", err); 
      } finally { 
        setIsSyncing(false); 
        console.log("🏁 Sync finished.");
      }
    };
    syncLogic();
  }, [mapboxData, provinces, setValue]);

  // Manual Handlers (Giữ nguyên logic cũ)
  const geocodeManual = async (addr) => {
      if(isSyncing || !addr) return;
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addr)}.json?access_token=${getMapboxAccessToken()}&country=VN&limit=1`;
        const res = await fetch(url); const data = await res.json();
        if(data.features?.[0]?.center) {
            const [lng, lat] = data.features[0].center;
            mapRef.current?.flyTo({ center: [lng, lat], zoom: 13 });
            markerRef.current?.setLngLat([lng, lat]);
            setValue("latitude", lat); setValue("longitude", lng);
        }
      } catch(e){}
  };
  
  const handleProvinceChange = async (code) => {
      if(isSyncing) return;
      const p = provinces.find(i=>i.value===code);
      setValue("provinceCode", code); setValue("province", p?.label, {shouldValidate:true});
      setValue("districtCode", ""); setValue("city", ""); setValue("ward", ""); setWards([]);
      try {
         const res = await axios.get(`${VN_API_BASE}p/${code}?depth=2`);
         setDistricts(res.data.districts.map(d=>({value:d.code, label:d.name})));
      } catch(e){}
      if(p) geocodeManual(t("owner:AdminSelectorsWithApi.vietnam", { label: p.label }));
  };

  const handleDistrictChange = async (code) => {
      if(isSyncing) return;
      const d = districts.find(i=>i.value===code);
      setValue("districtCode", code); setValue("city", d?.label, {shouldValidate:true}); setValue("ward", "");
      try {
         const res = await axios.get(`${VN_API_BASE}d/${code}?depth=2`);
         setWards(res.data.wards.map(w=>({value:w.name, label:w.name})));
      } catch(e){}
      if(d) geocodeManual(t("owner:AdminSelectorsWithApi.vietnam2", { label: d.label, value: watch("province") }));
  };

  return (
    <div className="relative w-full">
      {isSyncing && (
        <div className="absolute inset-0 z-50 bg-white/80 flex items-center justify-center rounded-lg border border-blue-200 backdrop-blur-[2px]">
          <span className="text-sm font-medium text-blue-500 flex gap-2 items-center">
            <span className="animate-spin text-xl">⟳</span> {t("owner:AdminSelectorsWithApi.syncingLocation")}
          </span>
        </div>
      )}
      <CustomSelect label={t("owner:AdminSelectorsWithApi.provinceCity")} options={provinces} value={provinceCode || ""} onChange={handleProvinceChange} error={errors.province?.message} disabled={isSyncing} placeholder={t("owner:AdminSelectorsWithApi.chooseAProvinceCity")} />
      <CustomSelect label={t("owner:AdminSelectorsWithApi.district")} options={districts} value={districtCode || ""} onChange={handleDistrictChange} error={errors.city?.message} disabled={!provinceCode || isSyncing} placeholder={t("owner:AdminSelectorsWithApi.chooseADistrict")} />
      <CustomSelect label={t("owner:AdminSelectorsWithApi.wardCommune")} options={wards} value={wardName || ""} onChange={(val)=>setValue("ward", val, {shouldValidate:true})} error={errors.ward?.message} disabled={!districtCode || isSyncing} placeholder={t("owner:AdminSelectorsWithApi.chooseAWardCommune")} />
    </div>
  );
}