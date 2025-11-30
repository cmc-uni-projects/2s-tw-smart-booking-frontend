import React, { useState } from "react";
import { Star, Eye, EyeOff, Trash2, Pin } from "lucide-react"; // ✅ Import Pin Icon

// Helper lấy đường dẫn ảnh
const API_BASE_URL = "http://localhost:8386";
const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/150?text=No+Image";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}/${path}`;
};

// ✅ Receive isOwner and onPin props
const ReviewCard = ({ review, isAdmin, isOwner, canDelete, onHide, onDelete, onOpenGallery, onPin }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if the user has permission to pin (Admin or Owner)
  const canPin = isAdmin || isOwner;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={`border-b border-slate-100 py-6 last:border-0 ${review.hidden ? 'opacity-60 bg-slate-50 p-4 rounded-lg' : ''} ${review.isPinned ? 'bg-blue-50/50 -mx-4 px-4 rounded-xl border border-blue-100' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
          <img
            src={review.userAvatar || `https://ui-avatars.com/api/?background=random&name=${review.userName || 'User'}`}
            alt={review.userName}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Header: Name + Actions */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800">{review.userName || "Người dùng ẩn danh"}</h4>
                  
                  {/* ✅ BADGE: Display if Pinned */}
                  {review.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                          <Pin size={10} className="fill-blue-600" /> Đã ghim
                      </span>
                  )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                 <span>{formatDate(review.createdAt)}</span>
                 {review.roomName && (
                    <>
                        <span>•</span>
                        <span>{review.roomName}</span>
                    </>
                 )}
              </div>
            </div>

            {/* Admin / Owner Actions */}
            <div className="flex gap-2">
                {/* ✅ BUTTON: Pin (Only for Admin/Owner) */}
                {canPin && (
                    <button
                        onClick={onPin}
                        className={`p-1.5 rounded-full transition-colors ${review.isPinned ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-200 text-slate-400'}`}
                        title={review.isPinned ? "Bỏ ghim" : "Ghim bình luận này (Max 3)"}
                    >
                        <Pin size={16} className={review.isPinned ? "fill-blue-600" : ""} />
                    </button>
                )}

                {/* Hide/Show (Admin only) */}
                {isAdmin && (
                    <button
                        onClick={onHide}
                        className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                        title={review.hidden ? "Hiện đánh giá" : "Ẩn đánh giá"}
                    >
                        {review.hidden ? <Eye size={16}/> : <EyeOff size={16}/>}
                    </button>
                )}

                {/* Delete (Admin or Owner) */}
                {canDelete && (
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                        title="Xóa đánh giá"
                    >
                        <Trash2 size={16}/>
                    </button>
                )}
            </div>
          </div>

          {/* Stars */}
          <div className="mt-2 flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < review.stars ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"
                }`}
              />
            ))}
          </div>

          {review.hidden && isAdmin && (
              <p className="mt-1 text-xs font-bold text-red-500">[Đánh giá này đang bị ẩn với người dùng thường]</p>
          )}

          {/* Comment */}
          <div className="mt-3 text-sm text-slate-700 leading-relaxed">
            <p className={!isExpanded ? "line-clamp-3" : ""}>
              {review.comment}
            </p>
            {review.comment && review.comment.length > 200 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-xs font-medium text-blue-600 hover:underline"
              >
                {isExpanded ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>

          {/* Images (with Zoom Logic) */}
          {review.images && review.images.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {review.images.map((img, idx) => (
                <div 
                    key={idx} 
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 cursor-zoom-in group relative"
                    onClick={() => onOpenGallery && onOpenGallery(idx, review.images)}
                >
                  <img
                    src={getImageUrl(img)}
                    alt="review-img"
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* Reply */}
          {review.reply && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm border-l-4 border-blue-200">
                <p className="font-bold text-slate-700 text-xs mb-1">Phản hồi từ chỗ nghỉ:</p>
                <p className="text-slate-600 italic">"{review.reply}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;