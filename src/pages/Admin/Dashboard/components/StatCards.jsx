import React, { useState } from "react";
import {
  Users,
  Building2,
  DollarSign,
  CalendarCheck,
  Star,
  Receipt,
  Tag,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import StatCard from "./StatCard"; // Component con
import Button from "../../../../components/common/Button/Button";

// Dữ liệu mock cho 8 thẻ
const allStats = [
  {
    title: "Tổng Doanh thu",
    value: "150.000.000₫",
    change: "+12.5%",
    icon: <DollarSign className="text-green-500" />,
  },
  {
    title: "Tổng Users",
    value: "1.250",
    change: "+32",
    icon: <Users className="text-blue-500" />,
  },
  {
    title: "Tổng Khách sạn",
    value: "320",
    change: "+5",
    icon: <Building2 className="text-purple-500" />,
  },
  {
    title: "Bookings (24h)",
    value: "45",
    change: "-2",
    icon: <CalendarCheck className="text-yellow-500" />,
  },
  {
    title: "Reviews mới",
    value: "12",
    change: "+3",
    icon: <Star className="text-orange-500" />,
  },
  {
    title: "Hóa đơn (tháng)",
    value: "210",
    change: "+15%",
    icon: <Receipt className="text-teal-500" />,
  },
  {
    title: "Mã giảm giá",
    value: "15",
    change: "3 active",
    icon: <Tag className="text-indigo-500" />,
  },
  {
    title: "Tin nhắn chờ",
    value: "3",
    change: "Tất cả",
    icon: <MessageSquare className="text-pink-500" />,
  },
];

const StatCards = () => {
  const [showAll, setShowAll] = useState(false);

  // Quyết định hiển thị 4 hay tất cả
  const statsToShow = showAll ? allStats : allStats.slice(0, 4);

  return (
    <div>
      {/* Grid cho các thẻ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsToShow.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>

      {/* Nút Show All */}
      <div className="mt-4 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          rightIcon={showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        >
          {showAll ? "Ẩn bớt" : "Xem tất cả thống kê"}
        </Button>
      </div>
    </div>
  );
};

export default StatCards;