import React, { useState } from "react";
import CustomerDashboardLayout from "../../../layouts/CustomerLayout/CustomerDashboardLayout";
import TextField from "@/components/common/Input/TextField";
import DatePicker from "@/components/common/Input/DatePicker";
import Select from "@/components/common/Select/Select";
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import { Save, Briefcase, X } from "lucide-react";
import { Link } from "react-router-dom";
import NotificationSettings from "./NotificationSettings";
import ChangePassword from "./ChangePassword";

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        fullName: "Nguyen Van A",
        email: "a@example.com",
        phone: "0123456789",
        address: "123 Đường ABC",
        gender: "male",
        dob: "1990-01-01",
        notifications: true,
    });

    const [formData, setFormData] = useState(userData);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: "", type: "info" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validatePhone = (phone) => /^0\d{9,10}$/.test(phone);

    const getAge = (dob) => {
        if (!dob) return 0;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (!validatePhone(formData.phone)) {
            setToast({ show: true, msg: "Số điện thoại không hợp lệ!", type: "error" });
            return;
        }

        const age = getAge(formData.dob);
        if (age < 18 || age > 90) {
            setToast({ show: true, msg: "Ngày sinh phải từ 18 đến 90 tuổi!", type: "error" });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setUserData(formData);
            setLoading(false);
            setToast({ show: true, msg: "Cập nhật thông tin thành công!", type: "success" });
        }, 1000);
    };

    const handleCancel = () => setFormData(userData);

    return (
        <CustomerDashboardLayout>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Hồ sơ cá nhân</h1>
            <p className="text-gray-600 text-sm mb-6">
                Quản lý thông tin cá nhân, mật khẩu và cài đặt tài khoản của bạn tại đây.
            </p>

            {/* Form thông tin cá nhân */}
            <Card className="mb-6">
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <TextField
                        label="Họ và tên"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        disabled
                        required
                    />
                    <TextField
                        label="Số điện thoại"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Địa chỉ"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <Select
                        label="Giới tính"
                        name="gender"
                        value={formData.gender}
                        onChange={(val) => setFormData({ ...formData, gender: val })}
                        options={[
                            { label: "Nam", value: "male" },
                            { label: "Nữ", value: "female" },
                            { label: "Khác", value: "other" },
                        ]}
                    />
                    <DatePicker
                        label="Ngày sinh"
                        value={formData.dob}
                        onChange={(val) => setFormData({ ...formData, dob: val })}
                    />

                    {/* Notification toggle */}
                    <NotificationSettings
                        value={formData.notifications}
                        onChange={(val) => setFormData({ ...formData, notifications: val })}
                    />

                    <div className="flex gap-3 mt-4">
                        <Button type="submit" leftIcon={<Save size={16} />} isLoading={loading}>
                            {loading ? "Đang lưu..." : "Lưu thông tin"}
                        </Button>
                        <Button variant="outline" leftIcon={<X size={16} />} onClick={handleCancel}>
                            Hủy
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Form đổi mật khẩu */}
            <ChangePassword currentPassword="12345678" />

            {/* Card “Đăng ký ngay” */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Toast */}
            <ToastPortal>
                {toast.show && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                        <Toast message={toast.msg} type={toast.type} />
                    </div>
                )}
            </ToastPortal>
        </CustomerDashboardLayout>
    );
};

export default ProfilePage;
