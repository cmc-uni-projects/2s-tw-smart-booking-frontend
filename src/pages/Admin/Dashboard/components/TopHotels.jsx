import React from "react";
import Card from "../../../../components/common/Card/Card";
import CardHeader from "../../../../components/common/Card/CardHeader";
import Badge from "../../../../components/common/Badge/Badge";
import { Hotel } from "lucide-react";

// Dữ liệu mock
const topHotels = [
  { id: 1, name: "Sunrise Resort", bookings: 120, revenue: "50.000.000₫" },
  { id: 2, name: "Ocean View", bookings: 98, revenue: "42.000.000₫" },
  { id: 3, name: "Hanoi Grand", bookings: 95, revenue: "38.000.000₫" },
  { id: 4, name: "DaLat Dream", bookings: 80, revenue: "25.000.000₫" },
];

const TopHotels = () => {
  return (
    <Card>
      <CardHeader
        title="Top khách sạn (Doanh thu)"
        icon={<Hotel className="text-[rgb(40,169,224)]" />}
      />
      <div className="space-y-4 mt-2 max-h-64 overflow-y-auto">
        {topHotels.map((hotel, index) => (
          <div key={hotel.id} className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-400">{index + 1}</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">{hotel.name}</p>
              <span className="text-xs text-gray-500">{hotel.bookings} bookings</span>
            </div>
            <Badge color="primary" icon={false}>{hotel.revenue}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopHotels;