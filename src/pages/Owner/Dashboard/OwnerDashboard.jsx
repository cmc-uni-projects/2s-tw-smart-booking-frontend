import React from "react";

// Import các component con từ thư mục ./components/
// Đây là các component được thiết kế riêng cho dashboard của Quản lý Khách sạn

// Hàng 1
import HotelStatCards from "./components/HotelStatCards"; // Ví dụ: Công suất phòng, Check-in/out hôm nay, Doanh thu ngày

// Hàng 2
import HotelRevenueChart from "./components/HotelRevenueChart"; // Biểu đồ doanh thu CỦA KHÁCH SẠN NÀY
import DailyActivityFeed from "./components/DailyActivityFeed"; // Feed: "Khách A check-in", "Phòng 201 đã dọn"

// Hàng 3
import OccupancyForecastChart from "./components/OccupancyForecastChart"; // Biểu đồ dự báo công suất phòngh
import RoomStatusOverview from "./components/RoomStatusOverview"; // Biểu đồ tròn (Sạch/Bẩn/Đang sửa)

// Hàng 4
import RecentReviewsWidget from "./components/RecentReviewsWidget"; // Hiển thị vài đánh giá mới nhất
import HousekeepingTasks from "./components/HousekeepingTasks"; // Danh sách phòng cần dọn

// Hàng 5
import UpcomingArrivalsTable from "./components/UpcomingArrivalsTable"; // Bảng khách sắp check-in

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
