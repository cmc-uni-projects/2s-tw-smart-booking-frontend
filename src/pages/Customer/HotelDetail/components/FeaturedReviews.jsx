import React from "react";
import { Star, Pin, MessageSquare } from "lucide-react";
import Button from "@/components/common/Button/Button";
import ReviewCard from "./ReviewCard"; // Tái sử dụng thẻ ReviewCard

const FeaturedReviews = ({
  hotel,
  pinnedReviews = [],
  onViewAll,
  isAdmin,
  isOwner,
  onOpenGallery,
  onUnpin
}) => {
  // Helper hiển thị chữ theo điểm số
  const getRatingText = (score) => {
      if (!score) return "Chưa có đánh giá";
      if (score >= 4.5) return "Tuyệt vời";
      if (score >= 4.0) return "Rất tốt";
      if (score >= 3.0) return "Hài lòng";
      return "Cần cải thiện";
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* --- PHẦN 1: TỔNG QUAN & HEADER --- */}
      <div className="p-8 bg-gradient-to-br from-white to-slate-50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="flex items-center gap-5">
            {/* Hộp điểm số */}
            <div className="relative shrink-0 group">
               <div className="w-24 h-24 flex items-center justify-center bg-slate-900 rounded-2xl shadow-xl transform rotate-3 transition-transform group-hover:rotate-0 duration-300">
                  <span className="text-4xl font-bold text-white">{hotel.rating || 0}</span>
               </div>
               <div className="absolute -top-2 -right-2 bg-yellow-400 p-1.5 rounded-full shadow-md border-2 border-white">
                  <Star className="w-4 h-4 text-white fill-white" />
               </div>
            </div>

            {/* Thông tin text */}
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-800">
                {getRatingText(hotel.rating)}
              </h3>
              <p className="text-slate-500 text-sm">
                Dựa trên <span className="font-semibold text-slate-900">{hotel.reviewsCount || 0}</span> đánh giá xác thực
              </p>
              {pinnedReviews.length > 0 && (
                <div className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                   <Pin size={12} className="fill-blue-600"/>
                   {pinnedReviews.length} đánh giá nổi bật
                </div>
              )}
            </div>
          </div>

          {/* Nút xem tất cả */}
          <Button
            onClick={onViewAll}
            className="bg-white border border-slate-200 text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white rounded-full px-8 py-3 shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            Xem tất cả đánh giá
          </Button>
        </div>
      </div>

      {/* --- PHẦN 2: DANH SÁCH GHIM (Nếu có) --- */}
      {pinnedReviews.length > 0 ? (
        <div className="border-t border-gray-100 bg-blue-50/30 p-6 md:p-8">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Pin size={16} className="text-blue-500" />
            Đánh giá được ghim
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            {pinnedReviews.map(review => (
              <div key={review.ratingId} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <ReviewCard
                    review={review}
                    isAdmin={isAdmin}
                    isOwner={isOwner}
                    onOpenGallery={onOpenGallery}
                    onPin={() => onUnpin(review.ratingId)} // Nút bỏ ghim
                    // Ẩn các nút xóa/ẩn ở đây để giao diện sạch sẽ (chỉ hiển thị trong sidebar)
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
         // Nếu không có bài ghim, hiển thị một câu khuyến khích nhỏ hoặc ẩn đi
         hotel.reviewsCount > 0 && (
             <div className="border-t border-gray-100 p-6 text-center text-slate-400 text-sm italic">
                <MessageSquare size={16} className="inline mr-2"/>
                Hãy xem tất cả đánh giá để có cái nhìn chi tiết nhất.
             </div>
         )
      )}
    </div>
  );
};

export default FeaturedReviews;