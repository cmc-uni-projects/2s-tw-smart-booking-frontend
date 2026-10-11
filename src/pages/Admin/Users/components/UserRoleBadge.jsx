import React from "react";
import PropTypes from "prop-types"; // ✅ 1. Import PropTypes
import Badge from "@/components/common/Badge/Badge";
import { useTranslation } from "react-i18next";

export default function UserRoleBadge({ role }) {
  const { t } = useTranslation();
    const getConfig = (r) => {
        // Chuyển về chữ hoa để đảm bảo khớp case nếu data backend trả về không nhất quán
        const normalizedRole = r ? r.toUpperCase() : "";

        switch (normalizedRole) {
            case "ADMIN":
                return { color: "primary", label: t("admin:UserRoleBadge.administrator") }; // Màu xanh dương
            case "OWNER":
                return { color: "primary", label: t("admin:UserRoleBadge.hotelOwner") }; // Màu vàng
            case "CUSTOMER":
                return { color: "success", label: t("admin:UserRoleBadge.customer") };   // Màu xanh lá
            default:
                return { color: "gray", label: r || t("admin:UserRoleBadge.unknown") };
        }
    };

    const config = getConfig(role);

    return <Badge color={config.color}>{config.label}</Badge>;
}

// ✅ 2. Thêm PropTypes để kiểm tra kiểu dữ liệu
UserRoleBadge.propTypes = {
    role: PropTypes.string,
};