// src/components/common/Card/TestimonialCard.jsx
import React from "react";
import Card from "@/components/common/Card/Card";
import Avatar from "@/components/common/Avatar/Avatar";
import Badge from "@/components/common/Badge/Badge";

// Component này nhận 1 prop là 'testimonial' (dữ liệu đánh giá)
export default function TestimonialCard({ testimonial }) {
  const { name, location, comment, rating } = testimonial;

  return (
    // Thêm 'h-full' để đảm bảo các card có chiều cao bằng nhau trong grid
    <Card className="p-6 text-center shadow hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
      <div>
        <Avatar name={name} className="mx-auto mb-3" />
        <p className="italic text-gray-600 mb-4">“{comment}”</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-800">{name}</h4>
        <p className="text-sm text-gray-500">{location}</p>
        <div className="mt-2">
          {/* Giữ nguyên logic Badge cũ */}
          <Badge>{rating}★</Badge>
        </div>
      </div>
    </Card>
  );
}