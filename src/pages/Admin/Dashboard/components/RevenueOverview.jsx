import React from "react";
import Card from "../../../../components/common/Card/Card";
import CardHeader from "../../../../components/common/Card/CardHeader";
import { PieChart } from "lucide-react";

// ✅ 1. Bỏ comment imports
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

// Dữ liệu mock
const mockPieData = [
  { name: "Website", value: 400 },
  { name: "Mobile App", value: 300 },
  { name: "Đối tác", value: 300 },
];
// ✅ 2. SỬA LỖI: Bỏ comment dòng COLORS
const COLORS = ["rgb(40, 169, 224)", "rgb(24, 119, 182)", "rgb(96, 203, 240)"];

const RevenueOverview = () => {
  return (
    <Card>
      <CardHeader
        title="Tổng quan Nguồn doanh thu"
        icon={<PieChart className="text-[rgb(40,169,224)]" />}
      />
      {/* ✅ 3. Sửa: Xóa h-64, gán height trực tiếp cho ResponsiveContainer */}
      <div className="w-full mt-4">
        {/* ✅ 4. Bỏ comment code Recharts */}
        <ResponsiveContainer width="100%" height={256}>
          <RechartsPieChart>
            <Pie
              data={mockPieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {mockPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueOverview;