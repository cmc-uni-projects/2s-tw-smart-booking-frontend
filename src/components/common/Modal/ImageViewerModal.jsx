import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageViewerModal({
  open,
  onClose,
  images = [],
  startIndex = 0,
}) {
  const [index, setIndex] = useState(startIndex);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (open) {
      setIndex(startIndex);
      resetTransform();
    }
  }, [open, startIndex]);

  if (!open || images.length === 0) return null;

  const current = images[index];

  const resetTransform = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  const next = () => {
    setIndex((i) => (i + 1) % images.length);
    resetTransform();
  };

  const prev = () => {
    setIndex((i) => (i - 1 + images.length) % images.length);
    resetTransform();
  };

  // Zoom bằng scroll
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomIntensity = 0.2;

    let newScale = scale + (e.deltaY < 0 ? zoomIntensity : -zoomIntensity);
    newScale = Math.min(Math.max(1, newScale), 4); // scale từ 1 → 4

    setScale(newScale);
  };

  // Pan ảnh
  const startPanImage = (e) => {
    if (scale <= 1) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const panImage = (e) => {
    if (!isPanning) return;
    setPos({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  };

  const endPanImage = () => setIsPanning(false);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${current.caption || "Ảnh"} (${index + 1}/${images.length})`}
      maxWidth="max-w-6xl"
    >
      <div
        className="relative w-full h-[75vh] bg-black rounded-lg overflow-hidden"
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={startPanImage}
        onMouseMove={panImage}
        onMouseUp={endPanImage}
        onMouseLeave={endPanImage}
        style={{
          cursor: scale > 1 ? "grab" : "default",
        }}
      >
        {/* Ảnh */}
        <img
          ref={imgRef}
          src={current.url}
          alt={current.caption}
          className="absolute top-1/2 left-1/2 max-w-none max-h-none select-none"
          draggable={false}
          style={{
            transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transition: isPanning ? "none" : "transform 0.25s ease",
          }}
        />

        {/* Nút PREV */}
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/70 transition"
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* Nút NEXT */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/70 transition"
            aria-label="Ảnh kế tiếp"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </Modal>
  );
}
