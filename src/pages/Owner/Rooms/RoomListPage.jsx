import React, { useState, useEffect } from "react";
import { Building2, Search, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import propertyService from "@/services/property.service";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button/Button";

// Helper xử lý ảnh
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (url) => {
  if (!url) return "/assets/images/placeholder.png";
  if (url.startsWith("http")) return url;
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) path = `/uploads${path}`;
  return `${API_BASE_URL}${path}`;
};

const RoomListPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchActiveProperties = async () => {
      // ⏱️ BẮT ĐẦU ĐO GIỜ
      console.log("🚀 [RoomListPage] Bắt đầu gọi API lấy danh sách tài sản...");
      const startTime = performance.now();

      try {
        setLoading(true);
        const res = await propertyService.getOwnerActiveProperties();
        
        // ⏱️ KẾT THÚC ĐO GIỜ
        const endTime = performance.now();
        console.log(`✅ [RoomListPage] API hoàn tất sau ${(endTime - startTime).toFixed(2)}ms`);
        console.log("📦 [RoomListPage] Dữ liệu nhận được:", res.data);

        setProperties(res.data || []);
      } catch (error) {
        console.error("❌ [RoomListPage] Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveProperties();
  }, []);

  const filteredProperties = properties.filter(p =>
    p.propertyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50/30">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Phòng nghỉ</h1>
        <p className="text-gray-500 mt-1">Chọn một cơ sở lưu trú để thiết lập và quản lý danh sách phòng</p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-8 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm cơ sở lưu trú..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 text-sm transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProperties.map((property) => (
              <motion.div
                layout
                key={property.propertyId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                onClick={() => navigate(`/owner/rooms/${property.propertyId}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getFullImageUrl(property.coverImage)}
                    alt={property.propertyName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold line-clamp-1">{property.propertyName}</h3>
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <Building2 size={14} /> {property.propertyType}
                    </p>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-center bg-white flex-grow">
                   <div className="text-sm text-gray-600">
                      <span className="block text-gray-400 text-xs uppercase font-semibold">Địa chỉ</span>
                      {property.city}
                   </div>
                   <Button size="sm" variant="outline" className="group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200">
                      Quản lý phòng <ArrowRight size={16} className="ml-1" />
                   </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-3xl border border-dashed border-gray-200">
           <Building2 size={48} className="text-gray-300 mb-3" />
           <p className="text-gray-500">Không tìm thấy cơ sở nào đang hoạt động.</p>
           <Button 
             variant="link" 
             onClick={() => navigate("/owner/properties")}
             className="mt-2 text-blue-600"
           >
             Kiểm tra lại danh sách tài sản
           </Button>
        </div>
      )}
    </div>
  );
};

export default RoomListPage;