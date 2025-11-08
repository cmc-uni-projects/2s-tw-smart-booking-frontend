import React from "react";
import CustomerDashboardLayout from "../../../layouts/CustomerLayout/CustomerDashboardLayout";

// 1. Thêm các import cần thiết từ nhánh 'feature'
import { Link } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import { Briefcase } from "lucide-react";

const ProfilePage = () => {
    return (
        <CustomerDashboardLayout>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Hồ sơ cá nhân</h1>
            <p className="text-gray-600 text-sm mb-6"> {/* Thêm mb-6 để tạo khoảng cách */}
                Quản lý thông tin cá nhân, mật khẩu và cài đặt tài khoản của bạn tại đây.
            </p>

            {/* 2. Thêm Card "Become Owner" vào đây */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bạn có thể thêm các Card khác (như Thông tin cá nhân, Đổi mật khẩu) ở đây */}

                {/* Card Trở thành đối tác */}
                <Card>
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg">Bạn là chủ khách sạn?</h3>
                            <p className="text-gray-600 text-sm">
                                Đăng ký cơ sở của bạn và tiếp cận hàng ngàn khách hàng.
                            </p>
                        </div>
                        <Link to="/become-owner">
                            <Button variant="outline" leftIcon={<Briefcase size={16} />}>
                                Đăng ký ngay
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </CustomerDashboardLayout>
    );
};

export default ProfilePage;