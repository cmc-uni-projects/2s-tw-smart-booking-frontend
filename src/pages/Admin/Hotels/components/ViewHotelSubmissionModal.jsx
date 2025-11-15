import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  MapPin,
  List,
  ShieldCheck,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";

// =====================================================
//  🔹 CUSTOM LARGE MODAL (NO Modal.jsx)
// =====================================================
const ModalPortal = ({ children }) => {
  return createPortal(children, document.body);
};

// =====================================================
//  🔹 INFO SECTION
// =====================================================
const InfoSection = ({ title, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="mb-8"
  >
    <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
      {React.cloneElement(icon, {
        size: 20,
        className: "mr-3 text-blue-600",
      })}
      {title}
    </h4>
    <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
  </motion.div>
);

// =====================================================
//  🔹 IMAGE SLIDER
// =====================================================
const ImageGallery = ({ images }) => {
  const [index, setIndex] = useState(0);

  if (!images?.length) {
    return <p className="text-sm text-gray-500 italic">Không có hình ảnh.</p>;
  }

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative w-full">
      <motion.div
        key={index}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        className="w-full h-56 rounded-xl overflow-hidden shadow bg-gray-100 border"
      >
        <img
          src={images[index].imageUrl}
          alt="img"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/70 backdrop-blur-md p-1.5 rounded-full shadow hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={next}
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/70 backdrop-blur-md p-1.5 rounded-full shadow hover:bg-white"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div className="absolute bottom-2 right-3 text-xs bg-black/50 text-white rounded-full px-2 py-0.5">
        {index + 1} / {images.length}
      </div>
    </div>
  );
};

// =====================================================
//  🔹 MAIN MODAL (CUSTOM)
// =====================================================
const ViewHotelSubmissionModal = ({ open, onClose, application }) => {
  if (!open || !application) return null;

  const owner = application.owner || {};
  const address = application.address || {};
  const amenities = application.amenities || [];
  const images = application.images || [];

  return (
    <ModalPortal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="
              fixed inset-0 z-[200]
              bg-black/40 backdrop-blur-sm
              flex items-center justify-center
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="
                bg-white rounded-2xl shadow-2xl w-[90%] max-w-5xl
                max-h-[85vh] overflow-hidden flex flex-col
              "
            >
              {/* HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{application.name}</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X size={22} className="text-gray-500 hover:text-gray-800" />
                </Button>
              </div>

              {/* SCROLLABLE BODY */}
              <div className="px-6 py-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* LEFT: Gallery */}
                <div className="lg:col-span-2">
                  <InfoSection title="Hình ảnh Cơ sở" icon={<ImageIcon />}>
                    <ImageGallery images={images} />
                  </InfoSection>
                </div>

                {/* RIGHT: Details */}
                <div className="lg:col-span-3">
                  <InfoSection title="Thông tin Chủ sở hữu" icon={<User />}>
                    <p><strong>Tên:</strong> {owner.fullName || "Chưa rõ"}</p>
                    <p><strong>Email:</strong> {owner.email || "Chưa rõ"}</p>
                    <p><strong>SĐT:</strong> {owner.phoneNumber || "Chưa rõ"}</p>
                  </InfoSection>

                  <InfoSection title="Địa chỉ Cơ sở" icon={<MapPin />}>
                    <p>{application.fullAddress || "Chưa rõ"}</p>
                  </InfoSection>

                  <InfoSection title="Mô tả" icon={<List />}>
                    <p className="whitespace-pre-line text-gray-800">
                      {application.description || "Không có mô tả."}
                    </p>
                  </InfoSection>

                  <InfoSection title="Tiện nghi" icon={<ShieldCheck />}>
                    {amenities.length ? (
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((am) => (
                          <Badge
                            key={am.id}
                            className="bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {am.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Không có tiện nghi.</p>
                    )}
                  </InfoSection>
                </div>
              </div>

              {/* FOOTER */}
              <div className="px-6 py-4 border-t flex justify-end bg-white">
                <Button variant="outline" onClick={onClose}>Đóng</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
};

export default ViewHotelSubmissionModal;
