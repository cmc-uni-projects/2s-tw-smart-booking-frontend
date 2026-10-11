import React from "react";
import PropTypes from "prop-types";
import Badge from "@/components/common/Badge/Badge";
import { useTranslation } from "react-i18next";

// ✅ QUAN TRỌNG: Phải có chữ 'default' ở đây
export default function UserStatusBadge({ status }) {
  const { t } = useTranslation();
    const getConfig = (s) => {
        // Chuẩn hóa input để tránh lỗi case sensitive
        const normalizedStatus = s ? s.toUpperCase() : "";

        switch (normalizedStatus) {
            case "ACTIVE":
                return { color: "success", label: t("admin:UserStatusBadge.active") };
            case "BANNED":
                return { color: "danger", label: t("admin:UserStatusBadge.locked") };
            case "PENDING":
                return { color: "warning", label: t("admin:UserStatusBadge.pending") };
            case "INACTIVE":
                return { color: "gray", label: t("admin:UserStatusBadge.inactive") };
            default:
                return { color: "primary", label: s || t("admin:UserStatusBadge.unknown") };
        }
    };

    const config = getConfig(status);

    return <Badge color={config.color}>{config.label}</Badge>;
}

UserStatusBadge.propTypes = {
    status: PropTypes.string,
};