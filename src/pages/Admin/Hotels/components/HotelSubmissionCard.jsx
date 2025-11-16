  import React from "react";
  import { Eye, Check, X, User, Calendar } from "lucide-react";
  import Button from "@/components/common/Button/Button";
  import Badge from "@/components/common/Badge/Badge";
  import { motion } from "framer-motion"; // ✅ Thêm Framer Motion

  // ✅ Định nghĩa animation cho card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  const HotelSubmissionCard = ({ hotel, onViewDetails, onApprove, onReject }) => {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout // Animate vị trí khi lọc
        className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden 
                  transition-all duration-300 ease-in-out
                  hover:shadow-lg hover:scale-[1.01] hover:border-blue-300" // ✅ Hiệu ứng Hover
      >
        {/* Cột Ảnh */}
        <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
          <img
            src={hotel.imageUrl}
            alt={`Ảnh của ${hotel.hotelName}`}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>

        {/* Cột Thông tin */}
        <div className="flex-grow p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                {hotel.hotelName}
              </h3>
              <Badge variant="warning" className="flex-shrink-0 ml-4">
                Chờ duyệt
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <User size={14} className="mr-2 flex-shrink-0 text-gray-500" />
                <span>Chủ sở hữu:{" "}
                  <span className="font-semibold text-gray-800">{hotel.ownerName}</span>
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar size={14} className="mr-2 flex-shrink-0 text-gray-500" />
                <span>Ngày nộp đơn:{" "}
                  <span className="font-semibold text-gray-800">{hotel.submittedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Cột Nút Bấm */}
          <div className="flex flex-col sm:flex-row gap-2 mt-5 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              leftIcon={<Eye size={16} />}
              className="flex-1"
            >
              Xem chi tiết
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              className="flex-1 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
              leftIcon={<X size={16} />}
            >
              Từ chối
            </Button>
            <Button
              size="sm"
              onClick={onApprove}
              className="flex-1" // Giữ màu solid mặc định (thường là xanh)
              leftIcon={<Check size={16} />}
            >
              Phê duyệt
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  export default HotelSubmissionCard;