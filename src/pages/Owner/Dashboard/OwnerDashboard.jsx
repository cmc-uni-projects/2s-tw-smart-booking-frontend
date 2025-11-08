import React from "react";

import HotelStatCards from "./components/HotelStatCards";

import HotelRevenueChart from "./components/HotelRevenueChart";
import DailyActivityFeed from "./components/DailyActivityFeed";

import OccupancyForecastChart from "./components/OccupancyForecastChart";
import RoomStatusOverview from "./components/RoomStatusOverview";

import RecentReviewsWidget from "./components/RecentReviewsWidget";
import HousekeepingTasks from "./components/HousekeepingTasks";
import UpcomingArrivalsTable from "./components/UpcomingArrivalsTable";

const OwnerDashboard = () => {
    return (
        <div className="space-y-6">

            {/* Hàng 1: Các thẻ thống kê vận hành */}
            {/* Thay vì thống kê toàn hệ thống, ở đây sẽ là:
        - Công suất phòng (Occupancy)
        - Số lượt check-in / check-out hôm nay
        - Doanh thu trong ngày (Today's Revenue)
        - ADR (Average Daily Rate)
      */}
            <HotelStatCards />

            {/* Hàng 2: Biểu đồ Doanh thu (của KS) và Hoạt động trong ngày */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Chỉ hiển thị doanh thu của khách sạn này */}
                    <HotelRevenueChart />
                </div>
                <div className="lg:col-span-1">
                    {/* Hiển thị các hoạt động mới nhất: "Khách A vừa check-in phòng 301", "Phòng 202 yêu cầu dọn" */}
                    <DailyActivityFeed />
                </div>
            </div>

            {/* Hàng 3: Dự báo công suất phòng và Tình trạng phòng */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Biểu đồ đường dự báo công suất phòng 7 ngày tới */}
                <OccupancyForecastChart />
                {/* Biểu đồ tròn: Số phòng Sẵn sàng / Đang dọn / Cần sửa chữa */}
                <RoomStatusOverview />
            </div>

            {/* Hàng 4: Đánh giá gần đây và Tác vụ dọn phòng */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    {/* Thay "Top Hotels" bằng "Đánh giá gần đây" về chính khách sạn này */}
                    <RecentReviewsWidget />
                </div>
                <div className="lg:col-span-2">
                    {/* Thay "Nguồn doanh thu" bằng danh sách tác vụ dọn phòng hoặc bảo trì */}
                    <HousekeepingTasks />
                </div>
            </div>

            {/* Hàng cuối: Bảng Khách sắp đến (Arrivals) */}
            <div className="shadow-lg rounded-lg overflow-hidden">
                {/* Thay vì "Bookings gần đây" (đã có trong feed),
          hiển thị "Danh sách khách sắp check-in" sẽ hữu ích hơn cho vận hành.
        */}
                <UpcomingArrivalsTable />
            </div>

        </div>
    );
};

export default OwnerDashboard;
