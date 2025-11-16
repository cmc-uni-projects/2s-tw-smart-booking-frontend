import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import {
  User,
  MapPin,
  List,
  Info,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import Button from "@/components/common/Button/Button";

const ViewHotelSubmissionModal = ({ open, onClose, application }) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!application) return null;

  // Tabs hiển thị
  const tabs = [
    { id: "info", name: "Thông tin cơ sở" },
    { id: "owner", name: "Chủ sở hữu" },
    { id: "location", name: "Định vị" },
    { id: "images", name: "Hình ảnh" },
  ];

  const fullAddress = `${application.address}, ${application.city}, ${application.country}`;

  return (
    <Modal
      open={open}
      onClose={() => {
        setActiveTab("info");
        onClose();
      }}
      title={application.propertyName || "Chi tiết cơ sở"}
      maxWidth="max-w-4xl"
    >
      {/* Tabs */}
      <div className="mb-6">
        <TabsComponent
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* TAB 1 – Thông tin cơ sở */}
      {activeTab === "info" && (
        <div className="space-y-6 animate-fadeIn">
          <Section title="Thông tin cơ sở" icon={<Info />}>
            <InfoRow label="Tên cơ sở" value={application.propertyName} />
            <InfoRow label="Loại" value={application.propertyType} />
            <InfoRow label="Địa chỉ" value={fullAddress} />
            <InfoRow label="Mã vùng" value={application.postalCode} />
            <InfoRow
              label="Ngày tạo"
              value={new Date(application.createdAt).toLocaleDateString("vi-VN")}
            />
          </Section>

          <Section title="Mô tả" icon={<List />}>
            <p className="text-gray-700 whitespace-pre-line">
              {application.description || "Không có mô tả."}
            </p>
          </Section>
        </div>
      )}

      {/* TAB 2 – Chủ sở hữu */}
      {activeTab === "owner" && (
        <div className="space-y-6 animate-fadeIn">
          <Section title="Thông tin Chủ sở hữu" icon={<User />}>
            <InfoRow label="Họ tên" value={application.ownerFullName} />
            <InfoRow label="Email" value={application.emailContact} />
          </Section>
        </div>
      )}

      {/* TAB 3 – Định vị */}
      {activeTab === "location" && (
        <div className="space-y-6 animate-fadeIn">
          <Section title="Vị trí địa lý" icon={<Globe />}>
            <InfoRow label="Latitude" value={application.latitude} />
            <InfoRow label="Longitude" value={application.longitude} />
          </Section>
        </div>
      )}

      {/* TAB 4 – Hình ảnh */}
      {activeTab === "images" && (
        <div className="animate-fadeIn">
          <Section title="Hình ảnh cơ sở" icon={<ImageIcon />}>
            <p className="text-gray-500 italic">Chưa có hình ảnh.</p>
          </Section>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
};

/* ---------------- COMPONENTS ---------------- */
const Section = ({ title, icon, children }) => (
  <div>
    <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">
      {React.cloneElement(icon, {
        size: 20,
        className: "mr-3 text-blue-600",
      })}
      {title}
    </h4>
    <div className="text-sm text-gray-700">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <p className="text-sm mb-1">
    <span className="font-medium text-gray-600">{label}:</span>{" "}
    <span className="text-gray-900">{value || "Không có"}</span>
  </p>
);

export default ViewHotelSubmissionModal;
