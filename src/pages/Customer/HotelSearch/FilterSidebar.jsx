import React from "react";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
// ✅ Xóa "Star" vì không còn dùng component sao
import { FilterX } from "lucide-react";

// Một section trong filter (ví dụ: "Thành phố", "Số sao")
const FilterSection = ({ title, children }) => (
  <div className="py-4 border-b border-gray-200 last:border-b-0">
    <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);

// Một lựa chọn checkbox (Giữ nguyên)
const CheckboxOption = ({ label, count }) => (
  <label className="flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
    <span className="flex items-center">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-[rgb(40,169,224)] focus:ring-[rgb(40,169,224)]"
      />
      <span className="ml-2">{label}</span>
    </span>
    {count && <span className="text-xs text-gray-400">{count}</span>}
  </label>
);

// ✅ ĐÃ XÓA COMPONENT StarRatingOption không còn dùng

export default function FilterSidebar() {
  return (
    // Dùng Card để tạo nền trắng và bo góc
    <Card className="p-0 overflow-hidden sticky top-24">
      {/* Header của Filter */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-[rgb(40,169,224)] hover:bg-blue-50"
          leftIcon={<FilterX size={14} />}
        >
          Xóa tất cả
        </Button>
      </div>

      {/* Thân của Filter */}
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">

        {/* Lọc theo Thành phố (mock data) */}
        <FilterSection title="Thành phố">
          <CheckboxOption label="Hà Nội" count={2} />
          <CheckboxOption label="Đà Nẵng" count={1} />
          <CheckboxOption label="Sapa" count={1} />
          <CheckboxOption label="Hồ Chí Minh" count={0} />
        </FilterSection>

        {/* ✅ ĐÃ XÓA PHẦN LỌC THEO HẠNG SAO */}

        {/* ✅ LỌC THEO ĐÁNH GIÁ (SỬA LẠI THEO YÊU CẦU) */}
        <FilterSection title="Đánh giá của khách">
          <CheckboxOption label="5 sao" />
          <CheckboxOption label="4 sao" />
          <CheckboxOption label="3 sao" />
          <CheckboxOption label="2 sao" />
          <CheckboxOption label="1 sao" />
        </FilterSection>

        {/* Lọc theo Địa điểm (Loại hình) */}
        <FilterSection title="Loại hình cư trú">
          <CheckboxOption label="Hotel" />
          <CheckboxOption label="Resort" />
          <CheckboxOption label="Homestay" />
          <CheckboxOption label="Villa" />
        </FilterSection>

      </div>
    </Card>
  );
}