import React, { useState, useEffect } from "react";
import { Plus, Search, Building2, Loader2 } from "lucide-react";
import Button from "@/components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import propertyService from "@/services/property.service";
import PropertyCard from "./components/PropertyCard";
import { AnimatePresence, motion } from "framer-motion";

// Import Modals
import ViewPropertyModal from "./components/ViewPropertyModal";
import EditPropertyModal from "./components/EditPropertyModal";
import Toast from "@/components/common/Notification/Toast"; // ✅ Import Toast

const PropertyListPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Modal State
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // ✅ Toast State
  const [toastData, setToastData] = useState(null);

  // Helpers
  const showToast = (message, type = "info") => {
      setToastData({ message, type });
      setTimeout(() => setToastData(null), 3000);
  };

  // Fetch Data
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await propertyService.getOwnerProperties();
      setProperties(res.data || []); 
    } catch (error) {
      console.error("Failed to fetch properties", error);
      showToast("Không thể tải danh sách tài sản", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Handlers
  const handleViewProperty = (property) => {
      setSelectedProperty(property);
      setIsViewModalOpen(true);
  };
  
  const handleEditProperty = (property) => {
      setSelectedProperty(property);
      setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
      setIsEditModalOpen(false);
      setSelectedProperty(null);
      fetchProperties(); 
      showToast("Cập nhật thông tin thành công!", "success"); // ✅ Thông báo thành công
  };
  
  const closeModals = () => {
      setIsViewModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedProperty(null);
  };

  // Filter & Stats (Giữ nguyên logic cũ)
  const filteredProperties = properties.filter(p => {
      const matchSearch = 
        p.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = 
        filterStatus === "ALL" ? true :
        filterStatus === "ACTIVE" ? (p.propertyStatus === "APPROVE" || p.propertyStatus === "APPROVED") :
        p.propertyStatus === filterStatus;
      return matchSearch && matchStatus;
  });

  const stats = {
      total: properties.length,
      active: properties.filter(p => p.propertyStatus === 'APPROVE' || p.propertyStatus === 'APPROVED').length,
      pending: properties.filter(p => p.propertyStatus === 'PENDING').length
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/30">
      
      {/* ✅ Render Toast */}
      {toastData && (
        <div className="fixed top-24 right-6 z-[9999]">
          <Toast message={toastData.message} type={toastData.type} />
        </div>
      )}

      {/* ... (Header & Filters giữ nguyên code cũ) ... */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tài sản của tôi</h1>
          <p className="text-gray-500 mt-1">Quản lý và theo dõi trạng thái các cơ sở lưu trú của bạn</p>
        </div>
        <Button 
            onClick={() => navigate("/owner/properties/new")} 
            leftIcon={<Plus size={20} />}
            className="shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
        >
          Thêm cơ sở mới
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-8">
         <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
             <div className="relative w-full lg:w-1/3">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text"
                    placeholder="Tìm theo tên khách sạn, địa chỉ..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex p-1 bg-gray-100 rounded-xl overflow-hidden w-full lg:w-auto">
                {[
                    { id: "ALL", label: "Tất cả" },
                    { id: "ACTIVE", label: "Đang hoạt động" },
                    { id: "PENDING", label: "Chờ duyệt" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterStatus(tab.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex-1 lg:flex-none whitespace-nowrap
                            ${filterStatus === tab.id 
                                ? "bg-white text-blue-600 shadow-sm" 
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
                    >
                        {tab.label}
                    </button>
                ))}
             </div>
             <div className="hidden xl:flex gap-6 text-sm border-l border-gray-100 pl-6">
                 <div className="text-center">
                     <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Tổng số</p>
                     <p className="font-bold text-gray-800 text-lg">{stats.total}</p>
                 </div>
                 <div className="text-center">
                     <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Hoạt động</p>
                     <p className="font-bold text-green-600 text-lg">{stats.active}</p>
                 </div>
                 <div className="text-center">
                     <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Chờ duyệt</p>
                     <p className="font-bold text-yellow-600 text-lg">{stats.pending}</p>
                 </div>
             </div>
         </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : filteredProperties.length > 0 ? (
        <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property.propertyId} 
                property={property} 
                onView={() => handleViewProperty(property)} 
                onEdit={() => handleEditProperty(property)} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm"
        >
            <div className="bg-blue-50 p-6 rounded-full mb-6 animate-pulse">
               <Building2 size={64} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm ? "Không tìm thấy kết quả" : "Bạn chưa có cơ sở lưu trú nào"}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md text-center leading-relaxed">
                {searchTerm 
                    ? `Không tìm thấy khách sạn nào phù hợp với từ khóa "${searchTerm}".` 
                    : "Hãy bắt đầu hành trình kinh doanh của bạn bằng cách đăng ký cơ sở lưu trú đầu tiên ngay hôm nay!"}
            </p>
            {!searchTerm && (
                <Button onClick={() => navigate("/owner/properties/new")} className="shadow-lg shadow-blue-500/20">
                    Đăng ký ngay
                </Button>
            )}
        </motion.div>
      )}

      <ViewPropertyModal 
        open={isViewModalOpen} 
        onClose={closeModals} 
        property={selectedProperty} 
      />
      
      <EditPropertyModal
        open={isEditModalOpen}
        onClose={closeModals}
        property={selectedProperty}
        onSuccess={handleEditSuccess}
        showToast={showToast} // ✅ Truyền hàm showToast xuống Modal
      />
    </div>
  );
};

export default PropertyListPage;