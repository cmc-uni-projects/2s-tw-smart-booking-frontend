import React, { useEffect, useState } from "react";
// Import ConfirmModal từ đường dẫn common (sử dụng alias @ nếu dự án đã cấu hình, hoặc đường dẫn tương đối)
import ConfirmModal from "@/components/common/Modal/ConfirmModal";
// Hoặc nếu không dùng alias: import ConfirmModal from "../../../../../components/common/Modal/ConfirmModal";

export default function SessionExpiredHandler() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("Phiên đăng nhập đã hết hạn.");

    useEffect(() => {
        // Hàm xử lý sự kiện
        const handleAccountLocked = (event) => {
            const msg = event.detail || "Tài khoản của bạn đã bị khóa.";
            setMessage(msg);
            setIsOpen(true);
        };

        // Lắng nghe sự kiện từ axios
        window.addEventListener("auth:account-locked", handleAccountLocked);

        // Dọn dẹp
        return () => {
            window.removeEventListener("auth:account-locked", handleAccountLocked);
        };
    }, []);

    const handleConfirm = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        setIsOpen(false);
        window.location.href = "/login";
    };

    return (
        <ConfirmModal
            open={isOpen}
            title="Thông báo hệ thống"
            message={message}
            confirmText="Đăng nhập lại"
            cancelText="" // Ẩn nút Hủy
            onConfirm={handleConfirm}
            onClose={handleConfirm} // Bắt buộc logout khi đóng
            type="danger"
        />
    );
}