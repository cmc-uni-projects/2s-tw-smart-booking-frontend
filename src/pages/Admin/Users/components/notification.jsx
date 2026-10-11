import React from "react";
import toast from "react-hot-toast";
import ModernToast from "./ModernToast";
import i18n from "@/i18n";

export const notify = {
    success: (message, title = i18n.t("admin:notification.success")) =>
        toast.custom((t) => (
            <ModernToast t={t} type="success" title={title} message={message} />
        )),

    error: (message, title = i18n.t("admin:notification.somethingWentWrong")) =>
        toast.custom((t) => (
            <ModernToast t={t} type="error" title={title} message={message} />
        )),

    warning: (message, title = i18n.t("admin:notification.warning")) =>
        toast.custom((t) => (
            <ModernToast t={t} type="warning" title={title} message={message} />
        )),

    info: (message, title = i18n.t("admin:notification.information")) =>
        toast.custom((t) => (
            <ModernToast t={t} type="info" title={title} message={message} />
        )),
};