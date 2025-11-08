import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../../../components/common/Button/Button";

export default function Step4_Success() {
    return (
        <div className="text-center py-10">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Gửi đơn thành công!</h2>
            <p className="mt-2 text-gray-600">
                Đơn đăng ký của bạn đã được gửi lên hệ thống. Chúng tôi sẽ xem xét và
                phản hồi bạn qua email trong thời gian sớm nhất.
            </p>
            <Link to="/">
                <Button className="mt-6">Về Trang chủ</Button>
            </Link>
        </div>
    );
}