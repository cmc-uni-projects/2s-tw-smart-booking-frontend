import React from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import { MapPin, AlertTriangle, CheckCircle2, XCircle, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

// Hàm tiện ích để hiển thị đúng Badge (sao chép từ PropertyCard)
const getStatusBadge = (status, isEnable) => {
  if (status === "PENDING") {
    return <Badge color="warning" icon={<AlertTriangle size={14} />}>{i18n.t("owner:ViewSubmissionModal.pending")}</Badge>;
  }
  if (status === "REJECTED") {
    return <Badge color="danger" icon={<XCircle size={14} />}>{i18n.t("owner:ViewSubmissionModal.rejected")}</Badge>;
  }
  if (status === "APPROVED") {
    if (isEnable) {
      return <Badge color="success" icon={<CheckCircle2 size={14} />}>{i18n.t("owner:ViewSubmissionModal.active")}</Badge>;
    } else {
      return <Badge color="gray" icon={<EyeOff size={14} />}>{i18n.t("owner:ViewSubmissionModal.deactivated")}</Badge>;
    }
  }
  return <Badge color="gray">{status}</Badge>;
};

// Component con để hiển thị thông tin
const InfoRow = ({ label, value }) => (
  <div>
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className="text-md text-gray-900">{value}</p>
  </div>
);

export default function ViewSubmissionModal({ open, onClose, property }) {
  const { t } = useTranslation();
  if (!property) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("owner:ViewSubmissionModal.propertyDetails")}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <InfoRow label={t("owner:ViewSubmissionModal.propertyName")} value={property.name} />
        <InfoRow label={t("owner:ViewSubmissionModal.address")} value={property.location} />
        
        <div>
          <span className="text-sm font-medium text-gray-500">{t("owner:ViewSubmissionModal.currentStatus")}</span>
          <div className="mt-1">
            {getStatusBadge(property.status, property.isEnable)}
          </div>
        </div>

        {/* Hiển thị lý do nếu bị từ chối hoặc đang chờ */}
        {property.status === "PENDING" && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            {t("owner:ViewSubmissionModal.yourApplicationIsBeingReviewed")}
          </div>
        )}
        {property.status === "REJECTED" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            <strong>{t("owner:ViewSubmissionModal.rejectionReasonExample")}</strong> {t("owner:ViewSubmissionModal.missingBusinessLicencePhotos")}
          </div>
        )}

      </div>
      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          {t("owner:ViewSubmissionModal.close")}
        </Button>
      </div>
    </Modal>
  );
}