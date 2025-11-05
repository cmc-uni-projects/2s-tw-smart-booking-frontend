import React from "react";
import CustomerDashboardLayout from "../../../layouts/CustomerLayout/CustomerDashboardLayout";

const ProfilePage = () => {
  return (
    <CustomerDashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Hồ sơ cá nhân</h1>
      <p className="text-gray-600 text-sm">
        Quản lý thông tin cá nhân, mật khẩu và cài đặt tài khoản của bạn tại đây.
      </p>
    </CustomerDashboardLayout>
  );
};

export default ProfilePage;
