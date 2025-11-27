import React from "react";

const SectionLink = ({ id, label, active }) => (
    <a 
        href={`#${id}`} 
        className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all duration-200 whitespace-nowrap
        ${active 
            ? 'border-[rgb(40,169,224)] text-[rgb(40,169,224)]' 
            : 'border-transparent text-gray-600 hover:text-[rgb(40,169,224)]'
        }`}
    >
        {label}
    </a>
);

const HotelStickyNav = ({ activeSection }) => {
  return (
    <div className="sticky top-[64px] z-40 bg-white border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-2 overflow-x-auto no-scrollbar">
            <SectionLink id="overview" label="Tổng quan" active={activeSection === "overview"} />
            <SectionLink id="rooms" label="Phòng nghỉ" active={activeSection === "rooms"} />
            <SectionLink id="amenities" label="Tiện nghi" active={activeSection === "amenities"} />
            <SectionLink id="policies" label="Chính sách" active={activeSection === "policies"} />
            <SectionLink id="reviews" label="Đánh giá" active={activeSection === "reviews"} />
        </div>
    </div>
  );
};

export default HotelStickyNav;