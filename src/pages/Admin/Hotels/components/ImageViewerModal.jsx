import React, { useState, useEffect, useRef } from "react";
import Modal from "@/components/common/Modal/Modal";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageViewerModal({
  open,
  onClose,
  images = [],
  startIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  
  // State quản lý vị trí (x, y) và độ phóng đại (scale)
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  
  // Refs để xử lý kéo thả mượt mà
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (open) {
      setCurrentIndex(startIndex);
      resetView();
    }
  }, [open, startIndex]);

  useEffect(() => {
    resetView();
  }, [currentIndex]);

  const resetView = () => {
    setTransform({ scale: 1, x: 0, y: 0 });
    isDragging.current = false;
  };

  if (!open || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHUỘT (ZOOM & PAN) ---

  // 1. Zoom bằng lăn chuột
  const handleWheel = (e) => {
    e.preventDefault(); // Chặn cuộn trang
    e.stopPropagation();

    const scaleSensitivity = 0.001; 
    const delta = -e.deltaY * scaleSensitivity;
    
    setTransform((prev) => {
        // Giới hạn zoom từ 0.5x đến 5x
        const newScale = Math.min(Math.max(0.5, prev.scale + delta), 5);
        return { ...prev, scale: newScale };
    });
  };

  // 2. Bắt đầu kéo (MouseDown)
  const handleMouseDown = (e) => {
    // Chỉ cho phép kéo bằng chuột trái và khi ảnh đang được phóng to hoặc di chuyển
    if (e.button !== 0) return; 
    
    // Nếu scale = 1, vẫn cho phép kéo nhẹ để tạo cảm giác linh hoạt, nhưng chủ yếu là khi zoom
    e.preventDefault();
    isDragging.current = true;
    
    startPos.current = {
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    };
    
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
  };

  // 3. Di chuyển chuột (MouseMove)
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    
    const newX = e.clientX - startPos.current.x;
    const newY = e.clientY - startPos.current.y;

    setTransform((prev) => ({ ...prev, x: newX, y: newY }));
  };

  // 4. Kết thúc kéo (MouseUp / MouseLeave)
  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      if (containerRef.current) {
         containerRef.current.style.cursor = transform.scale > 1 ? 'grab' : 'default';
      }
    }
  };

  // 5. Chuột phải để Reset
  const handleContextMenu = (e) => {
    e.preventDefault();
    resetView();
  };

  const cursorStyle = transform.scale > 1 ? (isDragging.current ? 'grabbing' : 'grab') : 'default';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Chi tiết ảnh (${currentIndex + 1}/${images.length}) - ${currentImage.caption || ''}`}
      maxWidth="max-w-7xl"
    >
      <div 
        ref={containerRef}
        // ✅ [SỬA]: Giảm chiều cao xuống h-[70vh] để vừa vặn trong Modal, không bị scroll
        className="relative w-full h-[70vh] bg-gray-900 rounded-lg overflow-hidden flex flex-col select-none touch-none"
        
        // Gán sự kiện
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        
        style={{ cursor: cursorStyle }}
      >
        
        {/* KHUNG CHỨA ẢNH */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center w-full h-full">
            <img
                src={currentImage.url}
                alt={currentImage.caption}
                style={{ 
                    // Áp dụng transform
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    // Tắt transition khi đang kéo để mượt mà, bật lại khi thả hoặc zoom
                    transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
                    // Chặn các hành vi mặc định của trình duyệt lên ảnh
                    pointerEvents: 'none', 
                    maxWidth: '100%',
                    maxHeight: '100%'
                }}
                className="object-contain will-change-transform"
                draggable={false}
            />
        </div>

        {/* Nút điều hướng (Overlay - Chỉ hiện khi không zoom quá to để tránh che) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 text-white/80 rounded-full hover:bg-black/60 hover:text-white transition-all z-30 backdrop-blur-[2px]"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 text-white/80 rounded-full hover:bg-black/60 hover:text-white transition-all z-30 backdrop-blur-[2px]"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}
        
        {/* Hướng dẫn nhỏ ở góc */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs bg-black/20 px-3 py-1 rounded-full pointer-events-none backdrop-blur-[1px]">
            Lăn chuột để Zoom • Kéo để di chuyển • Chuột phải để Reset
        </div>
      </div>
    </Modal>
  );
}