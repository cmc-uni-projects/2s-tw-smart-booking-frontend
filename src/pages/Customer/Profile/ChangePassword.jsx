import React, { useState } from "react";
import Card from "@/components/common/Card/Card";
import TextField from "@/components/common/Input/TextField";
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal"; // <-- thêm dòng này

const ChangePassword = ({ currentPassword }) => {
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: "", type: "info" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Validate cơ bản
        if (form.oldPassword !== currentPassword) {
            setToast({ show: true, msg: "Mật khẩu hiện tại không đúng", type: "error" });
            return;
        }
        if (form.newPassword.length < 8) {
            setToast({ show: true, msg: "Mật khẩu mới phải ít nhất 8 ký tự", type: "error" });
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setToast({ show: true, msg: "Xác nhận mật khẩu không khớp", type: "error" });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            handleCancel();
            setToast({ show: true, msg: "Đổi mật khẩu thành công", type: "success" });
        }, 1000);
    };

    return (
        <>
            <Card className="mb-6">
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg mb-4">Đổi mật khẩu</h3>
                    <TextField
                        label="Mật khẩu hiện tại"
                        name="oldPassword"
                        type="password"
                        value={form.oldPassword}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Mật khẩu mới"
                        name="newPassword"
                        type="password"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <div className="flex gap-3 mt-4">
                        <Button type="submit" isLoading={loading}>
                            {loading ? "Đang lưu..." : "Lưu mật khẩu"}
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                            Hủy
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Toast */}
            <ToastPortal>
                {toast.show && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                        <Toast message={toast.msg} type={toast.type} />
                    </div>
                )}
            </ToastPortal>
        </>
    );
};

export default ChangePassword;
