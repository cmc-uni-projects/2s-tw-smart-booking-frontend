import React from "react";
import Card from "../../../../components/common/Card/Card";
import CardHeader from "../../../../components/common/Card/CardHeader";
import { UserPlus } from "lucide-react";

// ✅ 1. Bỏ comment imports
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Dữ liệu mock
const mockUserData = [
  { name: "T5", newUsers: 120 },
  { name: "T6", newUsers: 150 },
  { name: "T7", newUsers: 130 },
  { name: "T8", newUsers: 180 },
  { name: "T9", newUsers: 210 },
  { name: "T10", newUsers: 250 },
];

const UserGrowthChart = () => {
  return (
    <Card>
      <CardHeader
        title="Tăng trưởng Người dùng (6 tháng)"
        icon={<UserPlus className="text-[rgb(40,169,224)]" />}
      />
      {/* ✅ 2. Sửa: Xóa h-64, gán height trực tiếp cho ResponsiveContainer */}
      <div className="w-full mt-4">
        {/* ✅ 3. Bỏ comment code Recharts */}
        <ResponsiveContainer width="100%" height={256}>
          <AreaChart data={mockUserData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(40, 169, 224)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="rgb(40, 169, 224)" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="newUsers"
              stroke="rgb(40, 169, 224)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUser)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default UserGrowthChart;