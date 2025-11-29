import React, { useState, useEffect, useRef } from "react";
import {
  X,
  MessageCircle,
  Hotel,
  MapPin,
  Star,
  Image as ImageIcon,
  Film,
  Trash2,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/common/Button/Button";
import RatingStars from "@/pages/Customer/MyBookings/components/RatingStars";

const ReviewBookingModal = ({ isOpen, onClose, booking, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ảnh & video (hiện mới ở UI, BE có thể xử lý qua onSubmit)
  const [images, setImages] = useState([]); // File[]
  const [videos, setVideos] = useState([]); // File[]

  // ref để scroll tới block comment khi có lỗi
  const commentBlockRef = useRef(null);

  const scrollToComment = () => {
    if (commentBlockRef.current) {
      commentBlockRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // 🔒 LOCK SCROLL BODY KHI MỞ MODAL
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // reset state khi mở modal lần mới
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setComment("");
      setImages([]);
      setVideos([]);
      setError("");
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const trimmedComment = comment.trim();
  const currentLength = trimmedComment.length;
  const isValid = rating > 0 && currentLength > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError("Vui lòng chọn số sao đánh giá.");
      scrollToComment();
      return;
    }

    if (!trimmedComment) {
      setError("Vui lòng nhập nội dung đánh giá.");
      scrollToComment();
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await onSubmit?.({
        rating,
        comment: trimmedComment,
        images,
        videos,
      });
      // onSubmit sẽ đóng modal / ném lỗi tuỳ logic bên ngoài
    } catch (err) {
      console.error("Modal catch submit error:", err);
      setSubmitting(false);
      setError(
        err?.message ||
          "Đã có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại."
      );
      scrollToComment();
    }
  };

  // chọn file ảnh + video
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const videoFiles = files.filter((f) => f.type.startsWith("video/"));

    setImages((prev) => [...prev, ...imageFiles].slice(0, 10));
    setVideos((prev) => [...prev, ...videoFiles].slice(0, 2));

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4">
      {/* Dùng form cho cả modal để submit chuẩn */}
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-fade-in"
      >
        {/* Header gradient – tone xanh chủ đạo */}
        <div className="relative border-b border-slate-100 bg-gradient-to-r from-[rgb(40,169,224)] via-[rgb(33,150,201)] to-[rgb(18,120,170)] px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-100/90">
                ĐÁNH GIÁ TRẢI NGHIỆM
              </p>
              <h3 className="mt-1 flex items-center gap-2 text-lg font-semibold">
                <Hotel size={18} className="text-yellow-300" />
                <span className="line-clamp-1">{booking.propertyName}</span>
              </h3>
              {booking.propertyAddress && (
                <p className="mt-1 flex items-center gap-1 text-xs text-sky-50">
                  <MapPin size={14} />
                  <span className="line-clamp-1">
                    {booking.propertyAddress}
                  </span>
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-1 rounded-full border border-white/30 bg-white/10 p-1.5 text-slate-100 hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chip booking id + note */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-full bg-black/20 px-3 py-1 font-mono text-[11px]">
              Mã đơn: BK-{booking.bookingId}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-medium text-sky-50 border border-white/30">
              <Star size={12} className="text-yellow-300" />
              Hãy chia sẻ cảm nhận chân thật của bạn
            </span>
          </div>
        </div>

        {/* Body cuộn được */}
        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50 px-5 py-5">
          {/* Stars */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm font-medium text-slate-700">
              Mức độ hài lòng tổng thể
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <RatingStars value={rating} onChange={setRating} />
              <span className="text-xs text-slate-500">
                {rating === 0 && "Nhấn để chọn số sao"}
                {rating === 1 && "1 sao – Rất tệ"}
                {rating === 2 && "2 sao – Chưa hài lòng"}
                {rating === 3 && "3 sao – Bình thường"}
                {rating === 4 && "4 sao – Hài lòng"}
                {rating === 5 && "5 sao – Tuyệt vời"}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div
            ref={commentBlockRef}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <MessageCircle size={16} className="text-[rgb(40,169,224)]" />
              Trải nghiệm của bạn tại chỗ nghỉ
            </label>
            <textarea
              className={`w-full rounded-xl border bg-slate-50 p-3 text-sm text-slate-800 outline-none transition
                ${
                  error
                    ? "border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    : "border-slate-300 focus:border-[rgb(40,169,224)] focus:bg-white focus:ring-1 focus:ring-[rgb(40,169,224)]"
                }`}
              rows={5}
              placeholder="Ví dụ: Phòng sạch sẽ, nhân viên thân thiện, vị trí thuận tiện, bữa sáng ngon, dịch vụ chưa tốt ở điểm nào..."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (error) setError(""); // gõ lại thì clear lỗi
              }}
            />

            {/* lỗi hiển thị NGAY dưới ô nhập */}
            {error && (
              <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-600">
                <AlertCircle size={14} />
                {error}
              </p>
            )}

            <div className="mt-2 flex items-center justify-between text-xs">
              <span
                className={
                  currentLength === 0 ? "text-amber-700" : "text-emerald-700"
                }
              >
                {currentLength === 0
                  ? "Vui lòng nhập nội dung đánh giá."
                  : "Bạn đã nhập nội dung, có thể gửi đánh giá."}
              </span>
              <span className="text-slate-400">
                {currentLength} ký tự
              </span>
            </div>
          </div>

          {/* Upload ảnh & video */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <ImageIcon size={16} className="text-[rgb(40,169,224)]" />
                Ảnh & video về chuyến đi (tuỳ chọn)
              </p>
              <span className="text-xs text-slate-400">
                {images.length > 0 || videos.length > 0
                  ? `${images.length} ảnh • ${videos.length} video`
                  : "Giúp người khác hình dung rõ hơn 👍"}
              </span>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-[rgb(40,169,224)] bg-slate-50 px-3 py-2 text-xs font-medium text-[rgb(40,169,224)] hover:bg-slate-100">
              <ImageIcon size={16} />
              <span>Thêm ảnh / video</span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleFilesChange}
              />
            </label>

            {(images.length > 0 || videos.length > 0) && (
              <div className="mt-3 space-y-3">
                {/* preview ảnh */}
                {images.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold text-slate-500">
                      Ảnh ({images.length}/10)
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((file, index) => {
                        const url = URL.createObjectURL(file);
                        return (
                          <div
                            key={index}
                            className="group relative h-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                          >
                            <img
                              src={url}
                              alt={file.name}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* preview video */}
                {videos.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold text-slate-500">
                      Video ({videos.length}/2)
                    </p>
                    <div className="space-y-2">
                      {videos.map((file, index) => {
                        const url = URL.createObjectURL(file);
                        return (
                          <div
                            key={index}
                            className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                          >
                            <video
                              src={url}
                              className="h-32 w-full object-cover"
                              controls
                            />
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                            <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] text-slate-50">
                              <Film size={10} />
                              Video
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer buttons cố định, không cuộn */}
        <div className="flex justify-end gap-3 border-t border-slate-200 bg-white px-5 py-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            Đóng
          </Button>
          <Button
            type="submit"
            disabled={!isValid || submitting}
            className="flex items-center gap-2 rounded-full bg-[rgb(40,169,224)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[rgb(30,145,198)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Star size={16} className="fill-yellow-400 text-yellow-300" />
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewBookingModal;
