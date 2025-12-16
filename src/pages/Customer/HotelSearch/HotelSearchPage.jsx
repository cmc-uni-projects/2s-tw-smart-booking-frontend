import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";
import SearchResultsList from "./SearchResultsList";
import propertyService from "@/services/property.service";
import SearchBox from "@/components/search/SearchBox"; 

const HotelSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // --- STATE DỮ LIỆU ---
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);       // Trang hiện tại
  const [hasMore, setHasMore] = useState(true); // Còn dữ liệu để load không?
  const [totalElements, setTotalElements] = useState(0);

  // --- STATE BỘ LỌC (Từ Sidebar & Sort) ---
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    sort: "id,desc" // Mặc định mới nhất
  });

  // Helper: Lấy values từ URL cho SearchBox
  const initialSearchValues = {
    destination: searchParams.get("keyword") || "",
    guests: parseInt(searchParams.get("guests")) || 2,
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
  };

  const handleSearch = (newParams) => {
      setSearchParams(newParams);
  };

  // --- HÀM GỌI API (QUAN TRỌNG) ---
  const fetchHotels = async (pageIndex) => {
    setLoading(true);
    try {
      // 1. Gom tất cả tham số (URL + Filters + Pagination)
      const params = {
        keyword: searchParams.get("keyword") || "",
        guests: searchParams.get("guests") || 1,
        checkIn: searchParams.get("checkIn"),
        checkOut: searchParams.get("checkOut"),
        
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
        
        page: pageIndex,
        size: 10 // Load 10 item mỗi lần
      };

      // 2. Gọi Service
      const res = await propertyService.searchProperties(params);
      
      // [FIX LOGIC LẤY DATA TẠI ĐÂY]
      let newHotels = [];
      let totalPages = 0;
      let totalItems = 0;

      // Cấu trúc response: { success: true, data: { content: [], ... } }
      // res chính là response body trả về từ service
      
      if (res.data && res.data.content) {
          // Trường hợp chuẩn: Dữ liệu nằm trong res.data.content
          newHotels = res.data.content || [];
          totalPages = res.data.totalPages || 0;
          totalItems = res.data.totalElements || 0;
      } 
      else if (res.content) {
          // Trường hợp dự phòng: Nếu service đã bóc tách data ra rồi
          newHotels = res.content || [];
          totalPages = res.totalPages || 0;
          totalItems = res.totalElements || 0;
      }
      else if (Array.isArray(res)) {
          // Trường hợp API cũ trả về mảng trực tiếp
          newHotels = res;
          totalPages = 1;
          totalItems = res.length;
      }

      console.log("Hotels parsed:", newHotels); // Debug: Kiểm tra xem đã lấy được chưa

      if (pageIndex === 0) {
        setHotels(newHotels);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setHotels(prev => [...prev, ...newHotels]);
      }

      setTotalElements(totalItems);
      
      // Logic hasMore
      if (totalPages <= 1) {
          setHasMore(false);
      } else {
          setHasMore(pageIndex < totalPages - 1);
      }

    } catch (error) {
      console.error("Failed to search hotels:", error);
      if (pageIndex === 0) setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  // --- EFFECT 1: KHI URL HOẶC FILTER THAY ĐỔI -> RESET VỀ TRANG 0 ---
  useEffect(() => {
    setPage(0);       // Reset page
    setHasMore(true); // Reset trạng thái load
    fetchHotels(0);   // Gọi ngay trang 0
  }, [searchParams, filters]); 

  // --- EFFECT 2: KHI PAGE TĂNG (DO SCROLL) -> LOAD TIẾP ---
  useEffect(() => {
    if (page > 0) {
      fetchHotels(page);
    }
  }, [page]);

  // --- INFINITE SCROLL LOGIC (INTERSECTION OBSERVER) ---
  const observer = useRef();
  
  // Ref này sẽ được gắn vào phần tử HotelCard cuối cùng
  const lastHotelElementRef = useCallback(node => {
    if (loading) return; // Đang load thì không làm gì
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      // Nếu thấy phần tử cuối cùng VÀ còn dữ liệu
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1); // Tăng page -> Trigger Effect 2
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // --- XỬ LÝ KHI SIDEBAR THAY ĐỔI ---
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
      <div className="min-h-screen bg-gray-50 pb-12">
        
        {/* Header Search Box */}
        <div className="bg-white border-b border-gray-200 sticky top-[64px] z-30 shadow-sm py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
             <SearchBox 
                initialValues={initialSearchValues}
                onSearch={handleSearch}
                className="shadow-none border-0 p-0 !gap-2" 
             />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LEFT SIDEBAR */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-48"> 
                {/* Truyền hàm callback xuống Sidebar */}
                <FilterSidebar onFilterChange={handleFilterChange} />
              </div>
            </div>

            {/* RIGHT RESULTS */}
            <div className="lg:col-span-3">
              
              {/* Header kết quả & Sort */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {loading && page === 0 ? "Đang tìm kiếm..." : `Tìm thấy ${totalElements} chỗ nghỉ`}
                </h2>
                
                <select 
                  className="border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.sort}
                  onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                >
                  <option value="id,desc">Mới nhất</option>
                  <option value="basePrice,asc">Giá thấp đến cao</option>
                  <option value="basePrice,desc">Giá cao đến thấp</option>
                </select>
              </div>

              {/* Danh sách kết quả */}
              <SearchResultsList 
                hotels={hotels} 
                loading={loading} 
                searchInfo={{ total: totalElements, location: initialSearchValues.destination }}
                lastElementRef={lastHotelElementRef} // [QUAN TRỌNG] Truyền Ref xuống để bắt sự kiện cuộn
              />

              {/* Loading Indicator cuối trang (Khi load thêm) */}
              {loading && page > 0 && (
                 <div className="py-6 text-center">
                   <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-gray-500 text-xs mt-2 font-medium">Đang tải thêm...</p>
                 </div>
              )}

              {/* Thông báo hết dữ liệu */}
              {!hasMore && hotels.length > 0 && (
                 <div className="py-8 text-center text-gray-400 text-sm border-t border-gray-100 mt-4">
                   Bạn đã xem hết danh sách.
                 </div>
              )}

            </div>
          </div>
        </div>
      </div>
  );
};

export default HotelSearchPage;