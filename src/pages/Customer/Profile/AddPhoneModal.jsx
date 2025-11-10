// src/pages/Customer/Profile/AddPhoneModal.jsx (Đã sửa nút "Thêm")

import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import TextField from "@/components/common/Input/TextField";
import Button from "@/components/common/Button/Button";

export default function AddPhoneModal({ isOpen, onClose, onSave }) {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePhone = () => {
        if (!phone) {
            setError("Vui lòng nhập số điện thoại.");
            return false;
        }
        // Giả định định dạng VN: bắt đầu bằng 0, 10-11 số
        if (!/^0\d{9,10}$/.test(phone)) {
            setError("Số điện thoại không hợp lệ (10-11 chữ số).");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (validatePhone()) {
            setLoading(true);

            // MÔ PHỎNG API: Gửi mã xác minh
            await new Promise(resolve => setTimeout(resolve, 800));

            onSave(phone); // Gọi hàm lưu/thay thế trong ProfilePage
            setPhone('');
            setLoading(false);
            onClose();
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="THÊM SỐ DI ĐỘNG"
        >
            <p className="text-sm text-gray-600 mb-4">
                Thêm số di động của bạn để đăng nhập và nhận thông báo khẩn cấp
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    name="phone"
                    type="tel"
                    placeholder="Ví dụ: 0901234567"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(''); }}
                    error={error}
                />

                <div className="pt-4 space-y-3">
                    <Button
                        type="submit"
                        fullWidth
                        isLoading={loading}
                        disabled={loading}
                        className="bg-[rgb(40,169,224)] hover:bg-[rgb(26,140,189)] text-white"
                    >
                        Thêm
                    </Button>
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={onClose}
                        className="bg-blue-100 border-blue-100 text-[rgb(40,169,224)] hover:bg-blue-200"
                    >
                        Hủy
                    </Button>
                </div>
            </form>
        </Modal>
    );
}