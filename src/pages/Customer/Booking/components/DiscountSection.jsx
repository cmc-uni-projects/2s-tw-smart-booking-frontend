import React, { useState } from 'react';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import { Tag, TicketPercent, X, ShieldCheck, Store } from 'lucide-react';
import PromotionSelectionModal from './PromotionSelectionModal';

// [CẬP NHẬT] Component con hiển thị 1 slot mã giảm giá
const DiscountSlot = ({ title, icon: Icon, promo, onSelectClick, onRemove, colorClass, emptyText }) => {
    return (
        <div className="mb-4 last:mb-0">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{title}</p>
            {!promo ? (
                // Trạng thái chưa chọn
                <div
                    className="border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all group"
                    onClick={onSelectClick}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${colorClass} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon size={16} className={colorClass.replace('bg-', 'text-')} />
                        </div>
                        <span className="text-sm text-gray-500 group-hover:text-gray-700">{emptyText}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-600 text-xs px-2">Chọn mã</Button>
                </div>
            ) : (
                // Trạng thái đã chọn
                <div className={`border bg-opacity-5 rounded-xl p-3 flex items-center justify-between ${colorClass.replace('bg-', 'border-').replace('text-', 'border-')} bg-white shadow-sm`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-8 h-8 rounded-full ${colorClass} bg-opacity-20 flex items-center justify-center shrink-0`}>
                            <TicketPercent size={16} className={colorClass.replace('bg-', 'text-')} />
                        </div>
                        <div className="min-w-0">
                            <p className={`text-sm font-bold ${colorClass.replace('bg-', 'text-')}`}>{promo.code}</p>
                            <p className="text-xs text-gray-500 truncate">{promo.description || "Đã áp dụng"}</p>
                        </div>
                    </div>
                    <button
                        onClick={onRemove}
                        className="p-1.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        title="Gỡ bỏ"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

// [CẬP NHẬT] Main Component
const DiscountSection = ({ onApplyAdmin, onApplyOwner, bookingOwnerId }) => {
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('ADMIN'); // 'ADMIN' or 'OWNER'

    // Selection State
    const [adminPromo, setAdminPromo] = useState(null);
    const [ownerPromo, setOwnerPromo] = useState(null);

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleSelectPromo = (promo) => {
        if (modalType === 'ADMIN') {
            setAdminPromo(promo);
            if (onApplyAdmin) onApplyAdmin(promo);
        } else {
            setOwnerPromo(promo);
            if (onApplyOwner) onApplyOwner(promo);
        }
        setIsModalOpen(false);
    };

    const handleRemove = (type) => {
        if (type === 'ADMIN') {
            setAdminPromo(null);
            if (onApplyAdmin) onApplyAdmin(null);
        } else {
            setOwnerPromo(null);
            if (onApplyOwner) onApplyOwner(null);
        }
    };

    return (
        <>
            <Card className="p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Tag size={20} className="text-blue-600" />
                    <h3 className="font-bold text-gray-800">Mã ưu đãi & Khuyến mãi</h3>
                </div>

                {/* Slot 1: Admin Promo */}
                <DiscountSlot
                    title="Voucher từ TravelMate"
                    icon={ShieldCheck}
                    colorClass="bg-blue-600"
                    promo={adminPromo}
                    emptyText="Chọn mã khuyến mãi hệ thống"
                    onSelectClick={() => openModal('ADMIN')}
                    onRemove={() => handleRemove('ADMIN')}
                />

                <div className="my-3 border-t border-dashed border-gray-200" />

                {/* Slot 2: Owner Promo */}
                <DiscountSlot
                    title="Voucher từ Khách sạn"
                    icon={Store}
                    colorClass="bg-purple-600"
                    promo={ownerPromo}
                    emptyText="Chọn mã ưu đãi của khách sạn"
                    onSelectClick={() => openModal('OWNER')}
                    onRemove={() => handleRemove('OWNER')}
                />
            </Card>

            {/* MODAL (Dùng chung cho cả 2 loại, thay đổi content dựa vào modalType) */}
            <PromotionSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectPromo}
                selectedId={modalType === 'ADMIN' ? adminPromo?.promotionId : ownerPromo?.promotionId}
                filterType={modalType}
                bookingOwnerId={bookingOwnerId}
            />
        </>
    );
};

export default DiscountSection;