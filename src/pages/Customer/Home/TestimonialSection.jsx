import React from "react";
import Card from "@/components/common/Card/Card";
import Avatar from "@/components/common/Avatar/Avatar";
import Badge from "@/components/common/Badge/Badge";

const testimonials = [
  { name: "Nguyễn Minh Anh", location: "Hà Nội", comment: "Trang web thân thiện, dễ dùng, đặt phòng chỉ vài bước là xong!", rating: 5 },
  { name: "Trần Quang Huy", location: "Đà Nẵng", comment: "Dịch vụ tuyệt vời, AI gợi ý khách sạn cực chuẩn!", rating: 4 },
  { name: "Lê Phương Thảo", location: "Hồ Chí Minh", comment: "Tôi tìm được resort đúng ý nhờ phần gợi ý thông minh!", rating: 5 },
];

const TestimonialSection = () => (
  <section className="max-w-6xl mx-auto px-6 mt-10">
    <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
      💬 Khách hàng nói gì về chúng tôi
    </h2>
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <Card key={i} className="p-6 text-center shadow hover:shadow-lg transition-shadow">
          <Avatar name={t.name} className="mx-auto mb-3" />
          <p className="italic text-gray-600 mb-4">“{t.comment}”</p>
          <h4 className="font-semibold text-gray-800">{t.name}</h4>
          <p className="text-sm text-gray-500">{t.location}</p>
          <div className="mt-2">
            <Badge>{t.rating}★</Badge>
          </div>
        </Card>
      ))}
    </div>
  </section>
);

export default TestimonialSection;
