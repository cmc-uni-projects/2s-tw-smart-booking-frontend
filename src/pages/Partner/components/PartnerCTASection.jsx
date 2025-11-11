import React from "react";
import { useNavigate } from "react-router-dom";
// 1. Import CtaButton thay vì Button
import CtaButton from "./CtaButton";

export default function PartnerCTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-gray-800 text-white overflow-hidden">
      {/* Lớp ảnh nền mờ */}
      <img
        src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"
        alt="CTA Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      {/* Lớp Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgb(40,169,224)]/70 to-[#006494]/90"></div>

      {/* Nội dung */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <h2 className="text-4xl font-extrabold mb-6 drop-shadow-md">
          Sẵn sàng để bắt đầu?
        </h2>
        <p className="text-lg text-gray-100 mb-10 max-w-xl mx-auto drop-shadow-sm">
          Chỉ mất vài phút để điền thông tin. Tham gia cộng đồng
          đối tác của chúng tôi và phát triển doanh thu ngay!
        </p>

        {/* 2. Sử dụng CtaButton mới */}
        <CtaButton onClick={() => navigate("/partner/register")}>
          Điền form đăng ký ngay
        </CtaButton>
      </div>
    </section>
  );
}