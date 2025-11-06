import React from "react";

// Import các component con từ thư mục ./components/
import StatCards from "./components/StatCards";
import RevenueChart from "./components/RevenueChart";
import RecentActivity from "./components/RecentActivity";
import RecentBookingsTable from "./components/RecentBookingsTable";

// ✅ THÊM MỚI 4 COMPONENTS
import BookingTrends from "./components/BookingTrends";
import RevenueOverview from "./components/RevenueOverview";
import TopHotels from "./components/TopHotels";
import UserGrowthChart from "./components/UserGrowthChart";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      
      {/* Hàng 1: Các thẻ thống kê */}
      <StatCards />

      {/* Hàng 2: Biểu đồ Doanh thu (cột) và Hoạt động gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
      
      {/* ✅ HÀNG MỚI: Thêm 2 biểu đồ (Xu hướng Booking và Tăng trưởng User) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingTrends />
        <UserGrowthChart />
      </div>
      
      {/* ✅ HÀNG MỚI: Thêm 2 thẻ (Nguồn Doanh thu và Top Khách sạn) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
           <TopHotels />
        </div>
        <div className="lg:col-span-2">
          <RevenueOverview />
        </div>
      </div>

      {/* Hàng cuối: Bảng Bookings */}
      <RecentBookingsTable />

    </div>
  );
};

export default AdminDashboard;