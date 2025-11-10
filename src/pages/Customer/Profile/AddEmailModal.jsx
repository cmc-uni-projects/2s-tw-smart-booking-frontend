// src/pages/Customer/Profile/AddEmailModal.jsx (Đã sửa nút "Thêm")

import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import TextField from "@/components/common/Input/TextField";
import Button from "@/components/common/Button/Button";

export default function AddEmailModal({ isOpen, onClose, onSave }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError("Vui lòng nhập địa chỉ email.");
            return false;
        }
        if (!emailRegex.test(email)) {
            setError("Địa chỉ email không hợp lệ.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (validateEmail()) {
            setLoading(true);

            // MÔ PHỎNG API: Gửi email xác minh
            await new Promise(resolve => setTimeout(resolve, 800));

            onSave(email); // Gọi hàm lưu/thay thế trong ProfilePage
            setEmail('');
            setLoading(false);
            onClose();
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="THÊM EMAIL"
        >
            <p className="text-sm text-gray-600 mb-4">
                Thêm email đang sử dụng của bạn để đăng nhập và nhận thông báo
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    name="email"
                    type="email"
                    placeholder="Ví dụ: yourname@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
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