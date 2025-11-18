// src/pages/Customer/HotelSearch/FilterSidebar.jsx
import React from "react";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import { FilterX } from "lucide-react";

// Một section trong filter (ví dụ: "Thành phố", "Số sao")
const FilterSection = ({ title, children }) => (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="flex flex-col gap-2">{children}</div>
    </div>
);

// Một lựa chọn checkbox
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

export default function FilterSidebar() {
    return (
        // ✅ SỬA Ở ĐÂY: Đã xóa class "sticky top-60"
        <Card className="p-0 overflow-hidden">
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

            {/* Thân của Filter (tự cuộn nếu quá dài) */}
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-360px)]">
                {/* Lọc theo Thành phố (mock data) */}
                <FilterSection title="Thành phố">
                    <CheckboxOption label="Hà Nội" count={2} />
                    <CheckboxOption label="Đà Nẵng" count={1} />
                    <CheckboxOption label="Sapa" count={1} />
                    <CheckboxOption label="Hồ Chí Minh" count={0} />
                </FilterSection>

                {/* LỌC THEO ĐÁNH GIÁ */}
                <FilterSection title="Đánh giá của khách">
                    <CheckboxOption label="5 sao" />
                    <CheckboxOption label="4 sao" />
                    <CheckboxOption label="3 sao" />
                    <CheckboxOption label="2 sao" />
                    <CheckboxOption label="1 sao" />
                </FilterSection>

                {/* +++ THÊM MỚI: KHOẢNG GIÁ +++ */}
                <FilterSection title="Khoảng giá (mỗi đêm)">
                    <CheckboxOption label="Dưới 1.000.000₫" />
                    <CheckboxOption label="1.000.000₫ - 2.000.000₫" />
                    <CheckboxOption label="2.000.000₫ - 3.000.000₫" />
                    <CheckboxOption label="Trên 3.000.000₫" />
                </FilterSection>

                {/* +++ THÊM MỚI: KHOẢNG CÁCH TỪ SÂN BAY +++ */}
                <FilterSection title="Khoảng cách từ sân bay">
                    <CheckboxOption label="Dưới 5 km" />
                    <CheckboxOption label="5 km - 10 km" />
                    <CheckboxOption label="10 km - 20 km" />
                    <CheckboxOption label="Trên 20 km" />
                </FilterSection>

                {/* +++ THÊM MỚI: TIỆN NGHI +++ */}
                <FilterSection title="Tiện nghi">
                    <CheckboxOption label="Hồ bơi" />
                    <CheckboxOption label="Wifi miễn phí" />
                    <CheckboxOption label="Chỗ đỗ xe" />
                    <CheckboxOption label="Nhà hàng" />
                    <CheckboxOption label="Lễ tân 24/7" />
                    <CheckboxOption label="Phòng tập gym" />
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