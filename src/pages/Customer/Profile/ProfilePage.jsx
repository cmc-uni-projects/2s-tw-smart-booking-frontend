// src/pages/Customer/Profile/ProfilePage.jsx (ĐÃ SỬA LỖI LOGIC TABS/TRANG TRẮNG)

import React, { useState } from "react";
import TextField from "@/components/common/Input/TextField";
import DatePicker from "@/components/common/Input/DatePicker";
import Select from "@/components/common/Select/Select";
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";

import SettingsPage from "./SettingsPage";
import ChangePassword from "./ChangePassword";
import AddEmailModal from "./AddEmailModal";
import AddPhoneModal from "./AddPhoneModal";
import AccountMenu from "./AccountMenu";

import { Save, X, Plus } from "lucide-react";

const PROFILE_TABS = [
    { id: "info", name: "Thông tin tài khoản" },
    { id: "security", name: "Mật khẩu & Bảo mật" },
];

const MOCK_EMAIL = { id: 1, email: "apksuyuki1@gmail.com", status: "verified", isPrimary: true };
const MOCK_PHONE = { id: 1, phone: "0901234567" };

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("info");
    const [activeSection, setActiveSection] = useState("account-settings");
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

    const [email, setEmail] = useState(MOCK_EMAIL);
    const [phone, setPhone] = useState(MOCK_PHONE);

    const [userData, setUserData] = useState({
        fullName: "Nguyen Van A",
        address: "123 Đường ABC",
        gender: "male",
        dob: "1990-01-01",
        notifications: true,
    });

    const [formData, setFormData] = useState(userData);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: "", type: "info" });

    const showToastAndDismiss = (msg, type = "info", duration = 3000) => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), duration);
    };

    const isFormDirty = () => {
        return JSON.stringify(formData) !== JSON.stringify(userData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
        const age = getAge(formData.dob);
        if (age < 18 || age > 90) {
            showToastAndDismiss("Ngày sinh phải từ 18 đến 90 tuổi!", "error");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setUserData(formData);
            setLoading(false);
            showToastAndDismiss("Cập nhật thông tin thành công!", "success");
        }, 1000);
    };

    const handleCancel = () => setFormData(userData);

    const handleSaveNewEmail = (newEmail) => {
        setEmail({ id: Date.now(), email: newEmail, status: "pending", isPrimary: true });
        showToastAndDismiss(`Email đã được cập nhật thành ${newEmail}. Vui lòng chờ xác minh!`, "info");
    };

    const handleSaveNewPhone = (newPhone) => {
        setPhone({ id: Date.now(), phone: newPhone });
        showToastAndDismiss(`Số di động đã được cập nhật thành ${newPhone}.`, "info");
    };

    const handleDeleteEmail = () => {
        setEmail(null);
        showToastAndDismiss("Đã xóa email khỏi tài khoản.", "warning");
    };

    const handleDeletePhone = () => {
        setPhone(null);
        showToastAndDismiss("Đã xóa số điện thoại khỏi tài khoản.", "warning");
    };

    // PHỤC HỒI HÀM RENDER NỘI DUNG TABS
    const renderContent = () => {
        switch (activeTab) {
            case "info":
                return renderInfoTab();
            case "security":
                return renderSecurityTab();
            default:
                return null;
        }
    };


    const renderInfoTab = () => {
        const GENDER_OPTIONS = [
            { label: "Nam", value: "male" },
            { label: "Nữ", value: "female" },
        ];

        const dirty = isFormDirty();

        return (
            <div className="space-y-10">
                <Card>
                    <form onSubmit={handleSave} className="p-6 space-y-4">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Dữ liệu cá nhân</h3>

                        <TextField label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        <TextField label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} />
                        <Select
                            label="Giới tính"
                            name="gender"
                            value={formData.gender}
                            onChange={(val) => setFormData((prev) => ({ ...prev, gender: val }))}
                            options={GENDER_OPTIONS}
                        />
                        <DatePicker label="Ngày sinh" value={formData.dob} onChange={(val) => setFormData((prev) => ({ ...prev, dob: val }))} />

                        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                            <Button type="submit" leftIcon={<Save size={16} />} isLoading={loading} disabled={loading || !dirty}>
                                {loading ? "Đang lưu..." : "Lưu thông tin"}
                            </Button>
                            {dirty && (
                                <Button variant="outline" leftIcon={<X size={16} />} onClick={handleCancel}>
                                    Hủy
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                {renderEmailSection()}
                {renderPhoneSection()}
            </div>
        );
    };

    const renderEmailSection = () => (
        <Card>
            <div className="p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                        <h3 className="font-semibold text-lg">Email</h3>
                        <p className="text-sm text-gray-500">Email dùng để đăng nhập và nhận thông báo.</p>
                    </div>
                    <Button variant="outline" size="sm" leftIcon={<Plus size={16} />} onClick={() => setIsEmailModalOpen(true)}>
                        {email ? "Sửa Email" : "Thêm Email"}
                    </Button>
                </div>

                <div className="space-y-3">
                    {email ? (
                        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <span className="font-medium text-gray-800">{email.email}</span>
                            <div className="flex items-center gap-3">
                                {email.status === "verified" && <span className="text-green-600 text-sm">Đã xác minh</span>}
                                {email.status === "pending" && <span className="text-yellow-600 text-sm font-medium">Chờ duyệt</span>}
                                <button onClick={handleDeleteEmail} className="text-red-500 hover:text-red-700 transition text-sm underline">
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Chưa có email nào được thêm.</p>
                    )}
                </div>
            </div>
        </Card>
    );

    const renderPhoneSection = () => (
        <Card>
            <div className="p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                        <h3 className="font-semibold text-lg">Số di động</h3>
                        <p className="text-sm text-gray-500">Số di động dùng để đăng nhập và nhận thông báo khẩn cấp.</p>
                    </div>
                    <Button variant="outline" size="sm" leftIcon={<Plus size={16} />} onClick={() => setIsPhoneModalOpen(true)}>
                        {phone ? "Sửa Số di động" : "Thêm Số di động"}
                    </Button>
                </div>

                <div className="space-y-3">
                    {phone ? (
                        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <span className="font-medium text-gray-800">{phone.phone}</span>
                            <button onClick={handleDeletePhone} className="text-red-500 hover:text-red-700 transition text-sm underline">
                                Xóa
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Chưa có số di động nào được thêm.</p>
                    )}
                </div>
            </div>
        </Card>
    );

    const renderSecurityTab = () => (
        <div className="space-y-10">
            <ChangePassword />
            <Card>
                <div className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2 mb-4 text-red-600">Xóa tài khoản</h3>
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-medium text-red-600">Xóa tài khoản</h4>
                            <p className="text-sm text-gray-500">Sau khi tài khoản của bạn bị xóa, bạn sẽ không thể phục hồi tài khoản hoặc dữ liệu của mình.</p>
                        </div>
                        <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                            Xóa
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderSettingsPage = () => <SettingsPage />;

    const renderMainContent = () => {
        if (activeSection === "account-settings") {
            return (
                <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Cài đặt</h1>
                    <TabsComponent tabs={PROFILE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
                    <div className="mt-8 md:mt-10">
                        {renderContent()} {/* ✅ Gọi hàm renderContent đã phục hồi */}
                    </div>
                </>
            );
        }

        if (activeSection === "notification-settings") {
            return renderSettingsPage();
        }

        return <h1 className="text-2xl font-bold text-gray-700">Nội dung tĩnh cho {activeSection}</h1>;
    };


    return (
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
                <AccountMenu activeSection={activeSection} onSelect={setActiveSection} userData={userData} />
            </div>

            <div className="col-span-9">
                {renderMainContent()}

                <ToastPortal>
                    {toast.show && (
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                            <Toast message={toast.msg} type={toast.type} />
                        </div>
                    )}
                </ToastPortal>
                <AddEmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} onSave={handleSaveNewEmail} />
                <AddPhoneModal isOpen={isPhoneModalOpen} onClose={() => setIsPhoneModalOpen(false)} onSave={handleSaveNewPhone} />
            </div>
        </div>
    );
};

export default ProfilePage;