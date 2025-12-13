import React from "react";
import PropTypes from "prop-types"; // ✅ 1. Import PropTypes
import Badge from "@/components/common/Badge/Badge";

export default function UserStatusBadge({ status }) {
    const getConfig = (s) => {
        // ✅ 2. Chuẩn hóa về chữ hoa để so sánh chính xác
        const normalizedStatus = s ? s.toUpperCase() : "";

        switch (normalizedStatus) {
            case "ACTIVE":
                return { color: "success", label: "Hoạt động" };
            case "BANNED":
                return { color: "danger", label: "Đã khóa" };
            case "PENDING":
                return { color: "warning", label: "Chờ duyệt" };
            case "INACTIVE":
                return { color: "gray", label: "Không hoạt động" };
            default:
                // Fallback nếu status lạ hoặc null
                return { color: "primary", label: s || "Không rõ" };
        }
    };

    const config = getConfig(status);

    return <Badge color={config.color}>{config.label}</Badge>;
}

// ✅ 3. Thêm PropTypes
UserStatusBadge.propTypes = {
    status: PropTypes.string,
};