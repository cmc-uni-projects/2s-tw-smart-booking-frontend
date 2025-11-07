import React from "react";
import Card from "../../../../components/common/Card/Card";
import CardHeader from "../../../../components/common/Card/CardHeader";
import { BarChart } from "lucide-react";

// ✅ 1. Bỏ comment imports
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Dữ liệu mock cho biểu đồ
const mockChartData = [
  { name: "T5", revenue: 25 },
  { name: "T6", revenue: 40 },
  { name: "T7", revenue: 30 },
  { name: "T8", revenue: 60 },
  { name: "T9", revenue: 55 },
  { name: "T10", revenue: 80 },
];

const RevenueChart = () => {
  return (
    <Card>
      <CardHeader
        title="Tổng quan Doanh thu (6 tháng)"
        subtitle="Đơn vị: Triệu VNĐ"
        icon={<BarChart className="text-[rgb(40,169,224)]" />}
      />
      {/* ✅ 2. Sửa: Xóa h-80, gán height trực tiếp cho ResponsiveContainer */}
      <div className="w-full mt-4">
        {/* ✅ 3. Bỏ comment code Recharts */}
        <ResponsiveContainer width="100%" height={320}>
          <RechartsBarChart data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}tr`} />
            <Tooltip
              cursor={{ fill: "rgba(40, 169, 224, 0.1)" }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                borderColor: "#eee",
              }}
            />
            <Bar dataKey="revenue" fill="rgb(40, 169, 224)" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;