import React from "react";
import Card from "../../../../components/common/Card/Card";
import CardHeader from "../../../../components/common/Card/CardHeader";
import { TrendingUp } from "lucide-react";

// ✅ 1. Bỏ comment imports
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Dữ liệu mock
const mockTrendData = [
  { name: "Mon", bookings: 12 },
  { name: "Tue", bookings: 15 },
  { name: "Wed", bookings: 8 },
  { name: "Thu", bookings: 14 },
  { name: "Fri", bookings: 22 },
  { name: "Sat", bookings: 30 },
  { name: "Sun", bookings: 25 },
];

const BookingTrends = () => {
  return (
    <Card>
      <CardHeader
        title="Xu hướng Booking (7 ngày)"
        icon={<TrendingUp className="text-[rgb(40,169,224)]" />}
      />
      {/* ✅ 2. Sửa: Xóa h-64, gán height trực tiếp cho ResponsiveContainer */}
      <div className="w-full mt-4">
        {/* ✅ 3. Bỏ comment code Recharts */}
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={mockTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                borderColor: "#eee",
              }}
            />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="rgb(40, 169, 224)"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default BookingTrends;