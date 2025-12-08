import React, { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Loading/Spinner';
import promotionService from "@/services/promotion.service";
import { TicketPercent, Calendar, CheckCircle2, ShieldCheck, Store } from 'lucide-react';

// Helper xử lý ảnh
const BE_BASE_URL = "http://localhost:8386";
const UPLOAD_DIR = "/uploads/";
const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150x100?text=No+Image";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BE_BASE_URL}${UPLOAD_DIR}${cleanPath}`;
};

// [CẬP NHẬT] Nhận thêm filterType ('ADMIN' | 'OWNER') và bookingOwnerId
const PromotionSelectionModal = ({ isOpen, onClose, onSelect, selectedId, filterType, bookingOwnerId }) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchPromotions();
        }
    }, [isOpen, filterType]);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const response = await promotionService.getAllPromotions();
            const rawData = Array.isArray(response) ? response : (response.data || []);

            const now = new Date();
            let activePromotions = rawData.filter(p => {
                const endDate = new Date(p.endDate);
                return p.status === "ACTIVE" && endDate > now;
            });

            // [LOGIC LỌC MỚI]
            if (filterType === 'ADMIN') {
                // Lấy khuyến mãi hệ thống (không có ownerId)
                activePromotions = activePromotions.filter(p => !p.ownerId);
            } else if (filterType === 'OWNER') {
                // Lấy khuyến mãi của Owner hiện tại
                // Lưu ý: Cần đảm bảo bookingOwnerId được truyền vào đúng
                if (bookingOwnerId) {
                    activePromotions = activePromotions.filter(p => p.ownerId === bookingOwnerId);
                } else {
                    activePromotions = []; // Không có ownerId thì không hiện gì
                }
            }

            setPromotions(activePromotions);
        } catch (error) {
            console.error("Lỗi tải khuyến mãi:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={filterType === 'ADMIN' ? "Ưu đãi từ TravelMate" : "Ưu đãi từ Khách sạn"}
            maxWidth="max-w-2xl"
        >
            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-8"><Spinner /></div>
                ) : promotions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 flex flex-col items-center gap-2">
                        <TicketPercent size={40} className="text-gray-300" />
                        <p>Không có mã khuyến mãi {filterType === 'ADMIN' ? 'hệ thống' : 'khách sạn'} nào khả dụng.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {promotions.map((promo) => {
                            const isSelected = selectedId === promo.promotionId;
                            return (
                                <div
                                    key={promo.promotionId}
                                    className={`relative flex flex-col sm:flex-row border rounded-xl overflow-hidden transition-all hover:shadow-md cursor-pointer ${isSelected ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                                    onClick={() => onSelect(promo)}
                                >
                                    {/* Ảnh thumbnail */}
                                    <div className="w-full sm:w-32 h-32 sm:h-auto shrink-0 bg-gray-100 relative">
                                        <img
                                            src={getFullImageUrl(promo.bannerUrl)}
                                            alt={promo.code}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Badge loại khuyến mãi */}
                                        <div className="absolute top-1 left-1">
                                            {!promo.ownerId ? (
                                                <div className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"><ShieldCheck size={10}/> Admin</div>
                                            ) : (
                                                <div className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"><Store size={10}/> Owner</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Nội dung */}
                                    <div className="flex-1 p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1">{promo.description || promo.name}</h4>
                                                {isSelected && <CheckCircle2 size={20} className="text-blue-600 shrink-0 ml-2" />}
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 border border-blue-200">
                                                    <TicketPercent size={12} /> {promo.code}
                                                </span>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar size={12} /> HSD: {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex justify-between items-center">
                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                Giảm {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `${promo.discountValue?.toLocaleString()}đ`}
                                                {promo.minBookingAmount > 0 && ` cho đơn từ ${promo.minBookingAmount?.toLocaleString()}đ`}
                                            </p>
                                            <Button
                                                size="sm"
                                                variant={isSelected ? "solid" : "outline"}
                                                className={`text-xs h-8 ${isSelected ? 'bg-blue-600 text-white' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelect(promo);
                                                }}
                                            >
                                                {isSelected ? "Đang dùng" : "Áp dụng"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <Button variant="ghost" onClick={onClose}>Đóng</Button>
            </div>
        </Modal>
    );
};

export default PromotionSelectionModal;