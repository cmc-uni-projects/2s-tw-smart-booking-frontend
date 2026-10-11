// src/pages/ComponentsPreview.jsx
import React, { useState } from "react";
import { Search, Plane, ArrowRight } from "lucide-react";

// ===== Common Components =====
import Button from "../components/common/Button/Button";
import Badge from "../components/common/Badge/Badge";
import Toast from "../components/common/Notification/Toast";
import Tooltip from "../components/common/Tooltip/Tooltip";
import Modal from "../components/common/Modal/Modal";
import ConfirmModal from "../components/common/Modal/ConfirmModal";
import EmptyState from "../components/common/EmptyState/EmptyState";
import Divider from "../components/common/Divider/Divider";
import Card from "../components/common/Card/Card";
import Breadcrumb from "../components/common/Breadcrumb/Breadcrumb";
import Dropdown from "../components/common/Dropdown/Dropdown";

// ===== Form Components =====
import TextField from "../components/common/Input/TextField";
import TextArea from "../components/common/Input/TextArea";
import SearchInput from "../components/common/Input/SearchInput";
import DatePicker from "../components/common/Input/DatePicker";
import DateRangePicker from "../components/common/Input/DateRangePicker";
import TimePicker from "../components/common/Input/TimePicker";
import Select from "../components/common/Select/Select";
import Table from "../components/common/Table/Table";

// ===== Loading Components =====
import Spinner from "../components/common/Loading/Spinner";
import Skeleton from "../components/common/Loading/Skeleton";
import LoadingOverlay from "../components/common/Loading/LoadingOverlay";
import { useTranslation } from "react-i18next";

export default function ComponentsPreview() {
  const { t } = useTranslation();
  // state
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [selected, setSelected] = useState("");

  // table data
  const columns = [
    { key: "name", label: t("common:ComponentsPreview.fullName") },
    { key: "email", label: "Email" },
    { key: "role", label: t("common:ComponentsPreview.role") },
    { key: "status", label: t("common:ComponentsPreview.status") },
  ];
  const data = [
    { name: t("common:ComponentsPreview.nguyenVanA"), email: "a..example.com", role: t("common:ComponentsPreview.customer"), status: t("common:ComponentsPreview.approved") },
    { name: t("common:ComponentsPreview.tranThiB"), email: "b..example.com", role: t("common:ComponentsPreview.hotelOwner"), status: t("common:ComponentsPreview.pending") },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-10 font-[Poppins] text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-[rgb(40,169,224)]">
        🎨 Smart Booking System — Components Preview
      </h1>

      {/* ============ BUTTONS ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="lg" leftIcon={<Plane size={18} />}>
            {t("common:ComponentsPreview.book")}
          </Button>
          <Button size="md" rightIcon={<ArrowRight size={16} />}>
            {t("common:ComponentsPreview.continue")}
          </Button>
          <Button size="sm" isLoading>
            {t("common:ComponentsPreview.processing")}
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </Card>

      <Divider />

      {/* ============ FORM COMPONENTS ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Form Components</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <TextField
            label={t("common:ComponentsPreview.fullName")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <TextArea
            label={t("common:ComponentsPreview.description")}
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
          />
          <SearchInput placeholder={t("common:ComponentsPreview.searchHotelsPlaces")} icon={<Search size={18} />} />
          <DatePicker label={t("common:ComponentsPreview.arrivalDate")} value={date} onChange={(e) => setDate(e.target.value)} />
          <TimePicker label={t("common:ComponentsPreview.checkInTime")} value={time} onChange={(e) => setTime(e.target.value)} />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={(e) => setStartDate(e.target.value)}
            onEndChange={(e) => setEndDate(e.target.value)}
          />
          <Select
            label={t("common:ComponentsPreview.roomType")}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            options={[
              { label: t("common:ComponentsPreview.singleRoom"), value: "single" },
              { label: t("common:ComponentsPreview.doubleRoom"), value: "double" },
              { label: "Suite", value: "suite" },
            ]}
          />
        </div>
      </Card>

      <Divider />

      {/* ============ TABLE ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Table Component</h2>
        <Table columns={columns} data={data} />
      </Card>

      <Divider />

      {/* ============ BADGES & TOASTS ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Badges & Notifications</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge>Primary</Badge>
          <Badge color="success">Success</Badge>
          <Badge color="warning">Warning</Badge>
          <Badge color="danger">Danger</Badge>
          <Badge color="gray" icon={false}>{t("common:ComponentsPreview.noIcon")}</Badge>
        </div>

        <div className="flex flex-col gap-3">
          <Toast message={t("common:ComponentsPreview.systemInformationIsBeingUpdated")} type="info" />
          <Toast message={t("common:ComponentsPreview.actionCompleted")} type="success" />
          <Toast message={t("common:ComponentsPreview.somethingWentWrongPleaseTry")} type="error" />
          <Toast message={t("common:ComponentsPreview.requiredInformationIsMissing")} type="warning" />
        </div>
      </Card>

      <Divider />

      {/* ============ TOOLTIP & MODAL ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Tooltip & Modal</h2>
        <div className="flex gap-6 items-center flex-wrap">
          <Tooltip text={t("common:ComponentsPreview.openInfoModal")} position="top">
            <Button onClick={() => setOpen(true)}>{t("common:ComponentsPreview.openMainModal")}</Button>
          </Tooltip>

          <Tooltip text={t("common:ComponentsPreview.confirmAction")} position="top">
            <Button variant="outline" onClick={() => setConfirmOpen(true)}>
              {t("common:ComponentsPreview.openConfirmmodal")}
            </Button>
          </Tooltip>
        </div>

        {/* Modal chính */}
        <Modal open={open} onClose={() => setOpen(false)} />

        {/* Confirm modal */}
        <ConfirmModal
          open={confirmOpen}
          type="warning"
          title={t("common:ComponentsPreview.deleteHotel")}
          message={t("common:ComponentsPreview.areYouSureYouWant")}
          confirmText={t("common:ComponentsPreview.delete")}
          cancelText={t("common:ComponentsPreview.cancel")}
          onConfirm={() => alert(t("common:ComponentsPreview.deletedSuccessfully"))}
          onClose={() => setConfirmOpen(false)}
        />
      </Card>

      <Divider />

      {/* ============ EMPTY STATE ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Empty State</h2>
        <EmptyState
          title={t("common:ComponentsPreview.noData")}
          description={t("common:ComponentsPreview.pleaseTryAgainLaterOr")}
        />
      </Card>

      <Divider />

      {/* ============ LOADING COMPONENTS ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Loading Components</h2>
        <div className="flex items-center justify-around gap-6 flex-wrap">
          <Spinner />
          <div className="flex flex-col gap-3 w-40">
            <Skeleton width="100%" height="20px" />
            <Skeleton width="80%" height="20px" />
            <Skeleton width="60%" height="20px" />
          </div>
          <Button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
          >
            {t("common:ComponentsPreview.showLoadingoverlay")}
          </Button>
        </div>
        {loading && <LoadingOverlay message={t("common:ComponentsPreview.processingBooking")} />}
      </Card>
      {/* ===== Breadcrumb & Dropdown Demo ===== */}
<Card>
  <h2 className="text-xl font-semibold mb-4">Breadcrumb & Dropdown</h2>

  <div className="mb-4">
    <Breadcrumb
      items={[
        { label: t("common:ComponentsPreview.hotel"), href: "/hotels" },
        { label: "Sunrise Resort", href: "/hotels/sunrise" },
        { label: t("common:ComponentsPreview.book") },
      ]}
    />
  </div>

  <Dropdown
    label={t("common:ComponentsPreview.actions")}
    items={[
      { label: t("common:ComponentsPreview.viewDetails"), onClick: () => console.log("detail") },
      { label: t("common:ComponentsPreview.copyCode"), onClick: () => console.log("copy") },
      { label: t("common:ComponentsPreview.delete"), danger: true, onClick: () => console.log("delete") },
    ]}
  />
</Card>


      <Divider />

      <div className="text-center text-gray-400 text-sm mt-8">
        Ⓒ Smart Booking System UI — designed with 💙 rgb(40,169,224)
      </div>
    </div>
  );
}




