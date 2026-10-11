import i18n from "@/i18n";
// src/utils/auditValueMapper.js

// Map enum / value backend → tiếng Việt cho Audit Log
export function formatAuditValue(value) {
    if (value === null || value === undefined) return null;

    // Nếu là chuỗi JSON rỗng
    if (value === "{}") return null;

    // Enum mapping
    const enumMap = {
        // PropertyStatus
        PENDING: i18n.t("admin:auditValueMapper.pending"),
        APPROVE: i18n.t("admin:auditValueMapper.approved"),
        APPROVED: i18n.t("admin:auditValueMapper.approved"),
        REJECTED: i18n.t("admin:auditValueMapper.rejected"),
        SUSPENDED: i18n.t("admin:auditValueMapper.pause"),
        ACTIVE: i18n.t("admin:auditValueMapper.active"),
        INACTIVE: i18n.t("admin:auditValueMapper.inactive"),

        // LogAction
        CREATE: i18n.t("admin:auditValueMapper.created"),
        UPDATE: i18n.t("admin:auditValueMapper.updated"),
        DELETE: i18n.t("admin:auditValueMapper.delete"),
        APPROVE_ACTION: i18n.t("admin:auditValueMapper.approve"),
        REJECT_ACTION: i18n.t("admin:auditValueMapper.rejected"),

        // EntityType
        PROPERTY: i18n.t("admin:auditValueMapper.properties"),
        ROOM: i18n.t("admin:auditValueMapper.room"),
        USER: i18n.t("admin:auditValueMapper.user"),
        BOOKING: i18n.t("admin:auditValueMapper.booking"),
        PROMOTION: i18n.t("admin:auditValueMapper.promotions"),
        SYSTEM: i18n.t("admin:auditValueMapper.system"),
    };

    // Nếu value là enum
    if (enumMap[value]) {
        return enumMap[value];
    }

    // Nếu là JSON string → pretty
    if (typeof value === "string" && value.startsWith("{")) {
        try {
            const obj = JSON.parse(value);
            return JSON.stringify(obj, null, 2);
        } catch {
            return value;
        }
    }

    return value;
}
