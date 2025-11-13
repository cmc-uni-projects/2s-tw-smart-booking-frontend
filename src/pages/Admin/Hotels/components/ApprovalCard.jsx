import React from "react";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import { Clock, User, CheckCircle, XCircle, Eye } from "lucide-react";

const ApprovalCard = ({ application, onApprove, onReject, onViewDetails }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1" title={application.hotelName}>
            {application.hotelName}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
            <User size={14} />
            <span className="line-clamp-1">{application.ownerName}</span>
          </div>
        </div>
        <Badge color="warning">Đang chờ</Badge>
      </div>

      {/* INFO */}
      <div className="space-y-2 mb-6 flex-grow">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Email:</span>
          <span className="text-gray-700 font-medium truncate max-w-[180px]" title={application.email}>
            {application.email}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-1">
            <Clock size={14} /> Ngày nộp:
          </span>
          <span className="text-gray-700 font-medium">
            {application.submittedDate}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          className="col-span-2 !w-full justify-center text-gray-600 border-gray-300 hover:bg-gray-50"
          onClick={onViewDetails}
          leftIcon={<Eye size={16} />}
        >
          Xem chi tiết
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="justify-center"
          onClick={onReject}
          leftIcon={<XCircle size={16} />}
        >
          Từ chối
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="justify-center"
          onClick={onApprove}
          leftIcon={<CheckCircle size={16} />}
        >
          Duyệt
        </Button>
      </div>
    </div>
  );
};

export default ApprovalCard;