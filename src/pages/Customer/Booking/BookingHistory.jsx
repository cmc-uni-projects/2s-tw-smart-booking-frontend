import React, { useState, useEffect } from "react";
import CustomerDashboardLayout from "../../../layouts/CustomerLayout/CustomerDashboardLayout";
import Table from "../../../components/common/Table/Table";
import Badge from "../../../components/common/Badge/Badge";
import Button from "../../../components/common/Button/Button";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // 🧩 Giả lập dữ liệu từ API (sau này có thể gọi từ backend /api/bookings)
    const mockData = [
      {
        id: 1,
        hotelName: "The Ocean Resort",
        checkIn: "2025-11-10",
        checkOut: "2025-11-15",
        totalPrice: 8200000,
        status: "CONFIRMED",
      },
      {
        id: 2,
        hotelName: "Hanoi Grand Hotel",
        checkIn: "2025-10-20",
        checkOut: "2025-10-23",
        totalPrice: 4200000,
        status: "CANCELLED",
      },
      {
        id: 3,
        hotelName: "DaLat Dream Villa",
        checkIn: "2025-09-05",
        checkOut: "2025-09-08",
        totalPrice: 3600000,
        status: "COMPLETED",
      },
    ];
    setBookings(mockData);
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-100 text-green-600">Đã xác nhận</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-600">Đã hủy</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-600">Hoàn tất</Badge>;
      default:
        return <Badge>Đang xử lý</Badge>;
    }
  };

  return (
      <CustomerDashboardLayout>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            🧾 Lịch sử đặt phòng
          </h1>

          {bookings.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>Chưa có đơn đặt phòng nào.</p>
              </div>
          ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                  <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Mã đơn</th>
                    <th className="px-4 py-3 text-left">Khách sạn</th>
                    <th className="px-4 py-3 text-center">Ngày nhận</th>
                    <th className="px-4 py-3 text-center">Ngày trả</th>
                    <th className="px-4 py-3 text-right">Tổng tiền</th>
                    <th className="px-4 py-3 text-center">Trạng thái</th>
                    <th className="px-4 py-3 text-center">Thao tác</th>
                  </tr>
                  </thead>
                  <tbody className="text-gray-700">
                  {bookings.map((b) => (
                      <tr key={b.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          #{b.id.toString().padStart(5, "0")}
                        </td>
                        <td className="px-4 py-3">{b.hotelName}</td>
                        <td className="px-4 py-3 text-center">
                          {new Date(b.checkIn).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {new Date(b.checkOut).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[rgb(40,169,224)]">
                          {b.totalPrice.toLocaleString("vi-VN")}₫
                        </td>
                        <td className="px-4 py-3 text-center">{renderStatus(b.status)}</td>
                        <td className="px-4 py-3 text-center">
                          <Button
                              size="sm"
                              variant="outline"
                              onClick={() => alert(`Chi tiết đơn #${b.id}`)}
                          >
                            Xem chi tiết
                          </Button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </Table>
              </div>
          )}
        </div>
      </CustomerDashboardLayout>
  );
};

export default BookingHistory;