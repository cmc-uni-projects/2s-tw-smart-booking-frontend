import React, { useState } from "react";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import { FilterX, Search, RotateCcw, MapPin, Star } from "lucide-react";
import MapEntryPoint from "@/pages/Customer/Explore/components/MapEntryPoint";

// Import các components con
import FilterSection from "./components/Filter/FilterSection";
import CheckboxOption from "./components/Filter/CheckboxOption";
import PriceRangeFilter from "./components/Filter/PriceRangeFilter";

export default function FilterSidebar({ onFilterChange }) {
    
    // --- STATE CHO CÁC BỘ LỌC KHÁC (Ngoài Giá) ---
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);

    // --- HANDLERS ---
    
    // 1. Nhận thay đổi từ PriceRangeFilter
    const handlePriceChange = ({ minPrice, maxPrice }) => {
        onFilterChange({ minPrice, maxPrice });
    };

    // 2. Reset toàn bộ
    const handleReset = () => {
        window.location.reload(); // Reset nhanh nhất
    };

    // 3. Xử lý checkbox (Demo logic)
    const handleCityToggle = (city) => {
        // Logic toggle city... (Sau này nối API sẽ gọi onFilterChange)
        if(selectedCities.includes(city)) setSelectedCities(prev => prev.filter(c => c !== city));
        else setSelectedCities(prev => [...prev, city]);
    };

    return (
        <div className="space-y-5 animate-fade-in-up">
            
            <MapEntryPoint />

            <Card className="p-0 overflow-hidden shadow-sm border border-gray-200 rounded-xl">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-50 p-1.5 rounded-lg text-[rgb(40,169,224)]">
                            <Search size={16} />
                        </div>
                        <h2 className="text-base font-bold text-gray-900">Bộ lọc</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 px-2 transition-colors"
                        leftIcon={<RotateCcw size={14} />}
                    >
                        Đặt lại
                    </Button>
                </div>

                <div className="p-5 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar bg-white">
                    
                    {/* --- MODULE 1: LỌC GIÁ (Đã tách riêng) --- */}
                    <PriceRangeFilter onChange={handlePriceChange} />

                    {/* --- MODULE 2: ĐỊA ĐIỂM (Demo) --- */}
                    <FilterSection title="Địa điểm phổ biến" icon={MapPin}>
                        {['Hà Nội', 'Đà Nẵng', 'Hồ Chí Minh', 'Vũng Tàu', 'Đà Lạt'].map(city => (
                            <CheckboxOption 
                                key={city} label={city} 
                                checked={selectedCities.includes(city)}
                                onChange={() => handleCityToggle(city)}
                            />
                        ))}
                    </FilterSection>

                    {/* --- MODULE 3: HẠNG SAO (Demo) --- */}
                    <FilterSection title="Hạng sao" icon={Star}>
                        {[5, 4, 3, 2, 1].map(star => (
                            <CheckboxOption 
                                key={star} 
                                label={
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">{star}</span>
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                    </div>
                                }
                                checked={selectedRatings.includes(star)}
                                onChange={() => { /* Logic toggle rating */ }}
                            />
                        ))}
                    </FilterSection>

                </div>
            </Card>
        </div>
    );
}