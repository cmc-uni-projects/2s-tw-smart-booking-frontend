import React from "react";
import Card from "../../../../components/common/Card/Card";
import CardHeader from "../../../../components/common/Card/CardHeader";
import Table from "../../../../components/common/Table/Table";
import Badge from "../../../../components/common/Badge/Badge";
import Button from "../../../../components/common/Button/Button";
import { Calendar } from "lucide-react";

const RecentBookingsTable = () => {
  // Dữ liệu giả cho bảng
  const tableColumns = [
    { key: "id", label: "Booking ID" },
    { key: "user", label: "Người dùng" },
    { key: "hotel", label: "Khách sạn" },
    { key: "amount", label: "Tổng tiền" },
    { key: "status", label: "Trạng thái" },
  ];

  const tableData = [
    {
      id: "#12345",
      user: "customer@travelmate.vn",
      hotel: "Sunrise Resort",
      amount: "2.500.000₫",
      status: <Badge color="success">Đã xác nhận</Badge>,
    },
    {
      id: "#12344",
      user: "test@gmail.com",
      hotel: "Ocean View",
      amount: "1.200.000₫",
      status: <Badge color="warning">Đang chờ</Badge>,
    },
    {
      id: "#12343",
      user: "owner@travelmate.vn",
      hotel: "Hanoi Grand",
      amount: "3.100.000₫",
      status: <Badge color="danger">Đã hủy</Badge>,
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Bookings gần nhất"
        icon={<Calendar className="text-[rgb(40,169,224)]" />}
      />
      
      {/* Sử dụng common Table */}
      <Table columns={tableColumns} data={tableData} />
      
      <div className="flex justify-end mt-4">
        <Button variant="outline" size="sm">
          Xem tất cả Bookings
        </Button>
      </div>
    </Card>
  );
};

export default RecentBookingsTable;