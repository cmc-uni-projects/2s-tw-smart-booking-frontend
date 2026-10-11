// src/pages/Admin/HotelSubmissions/components/ApproveHotelModal.jsx
import React from "react";
import ConfirmModal from "@/components/common/Modal/ConfirmModal";
import { useTranslation } from "react-i18next";

const ApproveHotelModal = ({ open, onClose, onConfirm, application }) => {
  const { t } = useTranslation();
  return (
    <ConfirmModal
      open={open}
      type="success"
      title={t("admin:ApproveHotelModal.approveProperty")}
      message={
        <>
          {t("admin:ApproveHotelModal.areYouSureYouWant")}{" "}
          <span className="font-semibold text-gray-800">
            {application?.hotelName}
          </span>
          ?
        </>
      }
      confirmText={t("admin:ApproveHotelModal.approve")}
      cancelText={t("admin:ApproveHotelModal.cancel")}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
};

export default ApproveHotelModal;
