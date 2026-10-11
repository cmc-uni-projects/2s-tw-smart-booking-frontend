import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Building2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import propertyService from "@/services/property.service";
import PropertyCard from "./components/PropertyCard";

// Import Modals & Toast
import ViewPropertyModal from "./components/ViewPropertyModal";
import EditPropertyModal from "./components/EditPropertyModal";
import DeactivateConfirmModal from "./components/DeactivateConfirmModal"; // ✅ Import Modal Xác nhận
import Toast from "@/components/common/Notification/Toast";
import { useTranslation } from "react-i18next"; 

const PropertyListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState(""); 
  const ITEMS_PER_PAGE = 8; 

  // Modal & Toast State
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // ✅ Thêm State cho Modal Xác nhận Tắt
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [propertyToDeactivate, setPropertyToDeactivate] = useState(null);

  const [toastData, setToastData] = useState(null);

  const showToast = (message, type = "info") => {
      setToastData({ message, type });
      setTimeout(() => setToastData(null), 3000);
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await propertyService.getOwnerProperties();
      setProperties(res.data || []); 
    } catch (error) {
      console.error("Failed to fetch properties", error);
      showToast(t("owner:PropertyListPage.couldNotLoadTheProperty"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // --- 1. HÀM XỬ LÝ CLICK VÀO SWITCH ---
  const handleToggleClick = (property) => {
      // ✅ SỬA LOGIC: Kiểm tra active
      // Chỉ mở Modal khi đang HOẠT ĐỘNG (Approved + Active) và muốn tắt đi
      // Nếu đang TẮT (Approved + Inactive) -> Bật lại luôn, không cần hỏi
      if ((property.propertyStatus === 'APPROVED' || property.propertyStatus === 'APPROVE') && property.active) {
          setPropertyToDeactivate(property);
          setIsDeactivateModalOpen(true);
      } else {
          executeToggleStatus(property);
      }
  };

  // --- 2. HÀM GỌI API THỰC SỰ (Dùng chung cho cả 2 trường hợp) ---
  const executeToggleStatus = async (property) => {
    try {
        await propertyService.togglePropertyStatus(property.propertyId);
        
        // ✅ SỬA LOGIC: Cập nhật active thay vì propertyStatus
        setProperties(prevProperties => 
            prevProperties.map(p => 
                p.propertyId === property.propertyId 
                ? { ...p, active: !p.active } // Đảo ngược trạng thái active
                : p
            )
        );
        
        // Reload lại cho chắc chắn
        fetchProperties();

        // ✅ SỬA LOGIC: Thông báo dựa trên trạng thái active CŨ
        // Nếu active = true -> đang Tắt -> "Đã tạm ngưng"
        // Nếu active = false -> đang Bật -> "Đã kích hoạt"
        const isTurningOff = property.active; 
        showToast(
            isTurningOff ? t("owner:PropertyListPage.suspended", { propertyName: property.propertyName }) : t("owner:PropertyListPage.reactivated", { propertyName: property.propertyName }), 
            "success"
        );
    } catch (error) {
        console.error("Failed to update status:", error);
        showToast(t("owner:PropertyListPage.couldNotUpdateTheStatus"), "error");
    }
  };

  // --- 3. HÀM XÁC NHẬN TỪ MODAL ---
  const handleConfirmDeactivate = () => {
      if (propertyToDeactivate) {
          executeToggleStatus(propertyToDeactivate); // Gọi API
          setIsDeactivateModalOpen(false);           // Đóng Modal
          setPropertyToDeactivate(null);             // Clear state
      }
  };

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredProperties = useMemo(() => {
      return properties.filter(p => {
          const matchSearch = 
            p.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.city?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchStatus = 
            filterStatus === "ALL" ? true :
            filterStatus === "ACTIVE" ? (p.propertyStatus === "APPROVE" || p.propertyStatus === "APPROVED") :
            p.propertyStatus === filterStatus;
          return matchSearch && matchStatus;
      });
  }, [properties, searchTerm, filterStatus]);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // --- LOGIC PHÂN TRANG ---
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const getPaginationGroup = () => {
      const delta = 1;
      const range = [];
      const rangeWithDots = [];
      let l;
      for (let i = 1; i <= totalPages; i++) {
          if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
              range.push(i);
          }
      }
      range.forEach(i => {
          if (l) {
              if (i - l === 2) rangeWithDots.push(l + 1);
              else if (i - l !== 1) rangeWithDots.push('...');
          }
          rangeWithDots.push(i);
          l = i;
      });
      return rangeWithDots;
  };

  const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
          document.getElementById('property-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  };

  const handleJumpPage = (e) => {
    if (e.key === 'Enter') {
        const page = parseInt(jumpPage);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setJumpPage("");
            document.getElementById('property-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
  };

  // Handlers Modal Xem/Sửa
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
      showToast(t("owner:PropertyListPage.informationUpdatedSuccessfully"), "success");
  };
  const closeModals = () => {
      setIsViewModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedProperty(null);
      // Đóng modal confirm nếu có
      setIsDeactivateModalOpen(false);
      setPropertyToDeactivate(null);
  };

  const stats = {
      total: properties.length,
      active: properties.filter(p => p.propertyStatus === 'APPROVE' || p.propertyStatus === 'APPROVED').length,
      pending: properties.filter(p => p.propertyStatus === 'PENDING').length
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/30">
      {toastData && (
        <div className="fixed top-24 right-6 z-[9999]">
          <Toast message={toastData.message} type={toastData.type} />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("owner:PropertyListPage.myProperties")}</h1>
          <p className="text-gray-500 mt-1">{t("owner:PropertyListPage.manageAndTrackTheStatus")}</p>
        </div>
        <Button 
            onClick={() => navigate("/owner/properties/new")} 
            leftIcon={<Plus size={20} />}
            className="shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
        >
          {t("owner:PropertyListPage.addNewProperty")}
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-8">
         <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
             <div className="relative w-full lg:w-1/3">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text"
                    placeholder={t("owner:PropertyListPage.searchProperties")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex p-1 bg-gray-100 rounded-xl overflow-hidden w-full lg:w-auto">
                {[
                    { id: "ALL", label: t("owner:PropertyListPage.all") },
                    { id: "ACTIVE", label: t("owner:PropertyListPage.active") },
                    { id: "PENDING", label: t("owner:PropertyListPage.pending") }
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
             <div className="hidden xl:flex gap-4 text-sm text-gray-500">
                 <span>{t("owner:PropertyListPage.total")} <b>{stats.total}</b></span>
                 <span className="text-gray-300">|</span>
                 <span className="text-green-600">{t("owner:PropertyListPage.active2")} <b>{stats.active}</b></span>
             </div>
         </div>
      </div>

      <div id="property-grid">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-gray-500 font-medium">{t("owner:PropertyListPage.loadingData")}</p>
        </div>
      ) : filteredProperties.length > 0 ? (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {paginatedProperties.map((property) => (
                <PropertyCard 
                    key={property.propertyId} 
                    property={property} 
                    onView={() => handleViewProperty(property)} 
                    onEdit={() => handleEditProperty(property)}
                    onToggleStatus={() => handleToggleClick(property)} // ✅ Kết nối sự kiện toggle
                />
                ))}
            </div>

            {/* THANH PHÂN TRANG */}
            <div className="mt-8 pt-6 border-t border-gray-200 bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        {t("owner:PropertyListPage.showing")} <span className="font-semibold text-gray-700">{paginatedProperties.length}</span> / <span className="font-semibold text-gray-700">{filteredProperties.length}</span> {t("owner:PropertyListPage.results")}
                    </span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex gap-1">
                            {getPaginationGroup().map((item, index) => (
                                <button key={index} onClick={() => typeof item === 'number' && handlePageChange(item)} disabled={item === '...'} className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${item === currentPage ? 'bg-[rgb(40,169,224)] text-white shadow-sm' : item === '...' ? 'bg-transparent text-gray-400 cursor-default' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{item}</button>
                            ))}
                        </div>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
               <Building2 size={64} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{searchTerm ? t("owner:PropertyListPage.noResultsFound") : t("owner:PropertyListPage.youHaveNoPropertiesYet")}</h3>
            <p className="text-gray-500 mb-8 max-w-md text-center leading-relaxed">{searchTerm ? t("owner:PropertyListPage.noMatchingHotelsFound") : t("owner:PropertyListPage.startYourBusinessJourney")}</p>
            {!searchTerm && (<Button onClick={() => navigate("/owner/properties/new")} className="shadow-lg shadow-blue-500/20">{t("owner:PropertyListPage.registerNow")}</Button>)}
        </div>
      )}
      </div>

      <ViewPropertyModal open={isViewModalOpen} onClose={closeModals} property={selectedProperty} />
      <EditPropertyModal open={isEditModalOpen} onClose={closeModals} property={selectedProperty} onSuccess={handleEditSuccess} showToast={showToast} />
      
      {/* ✅ RENDER MODAL XÁC NHẬN - Sử dụng 'isOpen' */}
      <DeactivateConfirmModal 
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleConfirmDeactivate}
        propertyName={propertyToDeactivate?.propertyName}
        isLoading={loading}
      />
    </div>
  );
};
export default PropertyListPage;