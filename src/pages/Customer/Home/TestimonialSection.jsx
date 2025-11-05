// src/pages/Customer/Home/TestimonialSection.jsx
import React from "react";
// ✅ Import component con mới
import TestimonialCard from "@/components/common/Card/TestimonialCard"; 

const testimonials = [
  { name: "Nguyễn Minh Anh", location: "Hà Nội", comment: "Trang web thân thiện, dễ dùng, đặt phòng chỉ vài bước là xong!", rating: 5 },
  { name: "Trần Quang Huy", location: "Đà Nẵng", comment: "Dịch vụ tuyệt vời, AI gợi ý khách sạn cực chuẩn!", rating: 4 },
  { name: "Lê Phương Thảo", location: "Hồ Chí Minh", comment: "Tôi tìm được resort đúng ý nhờ phần gợi ý thông minh!", rating: 5 },
];

const TestimonialSection = () => (
  <section className="max-w-6xl mx-auto px-6 mt-16 pb-10">
    <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
      💬 Khách hàng nói gì về chúng tôi
    </h2>
    
    {/* ✅ Sử dụng TestimonialCard thay vì logic inline */}
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <TestimonialCard key={i} testimonial={t} />
      ))}
    </div>
  </section>
);

export default TestimonialSection;