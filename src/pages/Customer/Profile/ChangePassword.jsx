// src/pages/Customer/Profile/ChangePassword.jsx

import React, { useState } from "react";
import Card from "@/components/common/Card/Card";
import TextField from "@/components/common/Input/TextField";
import Button from "@/components/common/Button/Button";
import { Save, X } from "lucide-react";

const initialFormState = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export default function ChangePassword() {
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // HÀM KIỂM TRA FORM CÓ DỮ LIỆU KHÁC RỖNG HAY KHÔNG
    const isFormDirty = () => {
        return (
            formData.currentPassword !== initialFormState.currentPassword ||
            formData.newPassword !== initialFormState.newPassword ||
            formData.confirmPassword !== initialFormState.confirmPassword
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null); // Xóa lỗi khi người dùng nhập
        setSuccess(false);
    };

    // HÀM XỬ LÝ HỦY: Đặt lại form về trạng thái rỗng ban đầu
    const handleCancel = () => {
        setFormData(initialFormState);
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        // --- Logic Validation Cơ bản ---
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError("Vui lòng điền đầy đủ tất cả các trường.");
            setLoading(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Mật khẩu mới và Xác nhận mật khẩu không khớp.");
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
            setLoading(false);
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
            setLoading(false);
            return;
        }
        // --- End Validation ---


        // MOCK API Call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulating success
        setSuccess(true);
        setFormData(initialFormState); // Reset form sau khi gửi thành công
        setLoading(false);
    };

    const dirty = isFormDirty();
    // Vô hiệu hóa Lưu khi đang tải, hoặc không có dữ liệu, hoặc mật khẩu mới không khớp
    const saveDisabled = loading || !dirty || (formData.newPassword !== formData.confirmPassword);


    return (
        <Card>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Đổi mật khẩu</h3>

                <TextField
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Mật khẩu mới (Tối thiểu 8 ký tự)"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                {/* Hiển thị thông báo (thay thế cho Toast tạm thời) */}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {success && <p className="text-green-500 text-sm mt-2">Mật khẩu đã được thay đổi thành công!</p>}


                <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                    <Button
                        type="submit"
                        leftIcon={<Save size={16} />}
                        isLoading={loading}
                        disabled={saveDisabled}
                    >
                        {loading ? "Đang lưu..." : "Lưu mật khẩu"}
                    </Button>

                    {/* CHỈ HIỂN THỊ NÚT HỦY KHI CÓ DỮ LIỆU ĐƯỢC NHẬP */}
                    {dirty && (
                        <Button variant="outline" leftIcon={<X size={16} />} onClick={handleCancel}>
                            Hủy
                        </Button>
                    )}
                </div>
            </form>
        </Card>
    );
}