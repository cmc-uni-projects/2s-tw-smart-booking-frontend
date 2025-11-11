import React, { useState, useEffect } from "react";
import Modal from "../../../../components/common/Modal/Modal";
// 1. ✅ Xóa icon 'X' khỏi import này
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageViewerModal({
  open,
  onClose,
  images = [],       
  startIndex = 0,  
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    if (open) {
      setCurrentIndex(startIndex);
    }
  }, [open, startIndex]);

  if (!open || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      // 2. ✅ Tiêu đề vẫn được giữ nguyên
      title={`Xem ảnh (${currentIndex + 1}/${images.length}) - ${currentImage.caption || ''}`}
      maxWidth="max-w-6xl" 
    >
      <div className="relative w-full h-[75vh] flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden">
        {/* Ảnh chính */}
        <img
          src={currentImage.url}
          alt={currentImage.caption}
          className="block max-h-full max-w-full object-contain"
        />

        {/* 3. ✅ ĐÃ XÓA NÚT 'X' BÊN TRONG ẢNH */}
        {/* <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-black/40 text-white rounded-full hover:bg-black/70 transition-colors z-20"
          aria-label="Đóng"
        >
          <X size={24} />
        </button> */}

        {/* Nút điều hướng (giữ nguyên) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/70 transition-colors z-10"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/70 transition-colors z-10"
              aria-label="Ảnh kế tiếp"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}