// src/pages/Customer/Booking/components/DiscountSection.jsx

import React, { useState, useRef, useEffect } from 'react';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import { Tag, TicketPercent, X, ShieldCheck, Store, ChevronDown } from 'lucide-react';
import PromotionSelectionDropdown from './PromotionSelectionModal'; // Import Dropdown Component

// Đường dẫn Public Path
const TRAVEL_MATE_LOGO_PUBLIC_PATH = "/assets/logo_promption/1.jpg";

// ====================================================================
// CON COMPONENT 1: NÚT GỠ BỎ MÃ (Giữ nguyên)
// ====================================================================
const PromoSlotRemoveButton = ({ onRemove }) => (
    <button
        onClick={onRemove}
        className="p-1.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors shrink-0"
        title="Gỡ bỏ"
    >
        <X size={16} />
    </button>
);

// ====================================================================
// CON COMPONENT 2: HIỂN THỊ MÃ ĐÃ CHỌN HOẶC TRẠNG THÁI CHƯA CHỌN
// ====================================================================
const PromoSlotDisplay = ({ promo, icon: Icon, colorClass, emptyText, onClick, isDropdownOpen, isAdminPromo, logoUrl }) => {
    // Kích thước mới: w-12 h-12
    const ICON_SIZE_CLASS = "w-20 h-19";

    // Kiểu hiển thị khi mã đã được chọn
    if (promo) {
        // Kiểm tra nếu là mã Admin, hiển thị Logo TravelMate
        const DisplayIcon = isAdminPromo ? (
            <div className={`${ICON_SIZE_CLASS} rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white`}>
                <img src={logoUrl} alt="TravelMate Logo" className="w-full h-full object-contain p-0.5" />
            </div>
        ) : (
            // Nếu là mã Owner, hiển thị Icon mặc định (Store)
            <div className={`${ICON_SIZE_CLASS} rounded-full ${colorClass} bg-opacity-20 flex items-center justify-center shrink-0`}>
                <TicketPercent size={20} className={colorClass.replace('bg-', 'text-')} />
            </div>
        );

        return (
            <div className={`border bg-opacity-5 rounded-xl p-3 flex items-center justify-between ${colorClass.replace('bg-', 'border-').replace('text-', 'border-')} bg-white shadow-sm`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    {DisplayIcon}
                    <div className="min-w-0">
                        <p className={`text-sm font-bold ${colorClass.replace('bg-', 'text-')}`}>{promo.code}</p>
                        <p className="text-xs text-gray-500 truncate">{promo.description || "Đã áp dụng"}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Kiểu hiển thị khi chưa có mã (CTA cho Dropdown)
    return (
        <div
            className={`relative border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                isDropdownOpen ? colorClass.replace('bg-', 'border-').replace('text-', 'border-') + ' ring-2 ring-offset-1 ' : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <div className={`${ICON_SIZE_CLASS} rounded-full ${colorClass} bg-opacity-10 flex items-center justify-center shrink-0`}>
                    <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-500">{emptyText}</p>
                    <p className="text-xs text-gray-400">Chọn để xem danh sách mã</p>
                </div>
            </div>

            <div className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-gray-600' : ''}`}>
                <ChevronDown size={16} />
            </div>
        </div>
    );
};

// ====================================================================
// CON COMPONENT 3: SLOT KHUYẾN MÃI (Bao gồm logic Dropdown & State)
// ====================================================================
const PromoSlotContainer = ({ title, icon, colorClass, emptyText, promo, onSelect, onRemove, filterType, bookingPropertyId, logoUrl }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isAdminPromo = filterType === 'ADMIN';

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectPromo = (selectedPromo) => {
        onSelect(selectedPromo);
        setIsOpen(false);
    };

    return (
        <div className="mb-5 last:mb-0" ref={dropdownRef}>
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{title}</p>

            <div className="relative">
                <PromoSlotDisplay
                    promo={promo}
                    icon={icon}
                    colorClass={colorClass}
                    emptyText={emptyText}
                    isDropdownOpen={isOpen}
                    isAdminPromo={isAdminPromo}
                    logoUrl={logoUrl}
                    onClick={() => {
                        if (!promo) setIsOpen(!isOpen);
                    }}
                />

                {promo && (
                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        <PromoSlotRemoveButton onRemove={onRemove} />
                    </div>
                )}

                {/* Dropdown Content */}
                {
                    !promo &&
                    <PromotionSelectionDropdown
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onSelect={handleSelectPromo}
                        selectedId={promo?.promotionId}
                        filterType={filterType}
                        bookingPropertyId={bookingPropertyId} // ✅ [UPDATE] Truyền propertyId xuống Modal
                    />
                }
            </div>
        </div>
    );
};

// ====================================================================
// MAIN COMPONENT: DiscountSection
// ====================================================================
const DiscountSection = ({ onApplyAdmin, onApplyOwner, bookingPropertyId }) => { // ✅ [UPDATE] Nhận prop bookingPropertyId
    // Selection State
    const [adminPromo, setAdminPromo] = useState(null);
    const [ownerPromo, setOwnerPromo] = useState(null);

    // Logic xử lý khi chọn/gỡ bỏ mã
    const handleSelectPromo = (type, promo) => {
        if (type === 'ADMIN') {
            setAdminPromo(promo);
            if (onApplyAdmin) onApplyAdmin(promo);
        } else {
            setOwnerPromo(promo);
            if (onApplyOwner) onApplyOwner(promo);
        }
    };

    const handleRemove = (type) => {
        handleSelectPromo(type, null);
    };

    return (
        <Card className="p-5 border border-gray-200 shadow-xl rounded-xl">
            {/* Component Header riêng biệt */}
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <Tag size={20} className="text-blue-600" />
                <h3 className="font-bold text-xl text-gray-800">Mã ưu đãi & Khuyến mãi</h3>
            </div>

            {/* Slot 1: Admin Promo */}
            <PromoSlotContainer
                title="VOUCHER TỪ TRAVELMATE"
                icon={ShieldCheck}
                colorClass="text-blue-600 bg-blue-600"
                promo={adminPromo}
                emptyText="TravelMate Voucher"
                onSelect={(promo) => handleSelectPromo('ADMIN', promo)}
                onRemove={() => handleRemove('ADMIN')}
                filterType={'ADMIN'}
                logoUrl={TRAVEL_MATE_LOGO_PUBLIC_PATH}
                // Admin không cần propertyId để lọc
            />

            <div className="my-3 border-t border-dashed border-gray-200" />

            {/* Slot 2: Owner Promo */}
            <PromoSlotContainer
                title="VOUCHER TỪ KHÁCH SẠN"
                icon={Store}
                colorClass="text-purple-600 bg-purple-600"
                promo={ownerPromo}
                emptyText="Partner Voucher"
                onSelect={(promo) => handleSelectPromo('OWNER', promo)}
                onRemove={() => handleRemove('OWNER')}
                filterType={'OWNER'}
                bookingPropertyId={bookingPropertyId} // ✅ [UPDATE] Truyền ID khách sạn xuống
            />
        </Card>
    );
};

export default DiscountSection;