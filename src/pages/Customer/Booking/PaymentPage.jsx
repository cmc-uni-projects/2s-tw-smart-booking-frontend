import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Divider from '@/components/common/Divider/Divider';
// ✅ MỚI: Thêm ArrowLeft vào import
import { 
    MapPin, Calendar, BedDouble, Users, CheckCircle2, 
    User, Phone, Mail, Wifi, Coffee, Ban, Receipt, Tag, ArrowLeft 
} from 'lucide-react';
import PaymentForm from './PaymentForm';
import QRCodeModal from './QRCodeModal';     
import SuccessModal from './SuccessModal'; 

import './PaymentPage.css';

/* ----------------------------------------
   PAYMENT SUMMARY (Giữ nguyên logic hiển thị)
---------------------------------------- */
const PaymentSummary = ({ bookingData }) => {
    const { hotel, room, guestDetails } = bookingData;
    const nights = 1;

    const renderSpecialRequests = () => {
        const requests = guestDetails?.specialRequests;
        if (!requests) return <span className="request-value">-</span>;

        const selectedRequests = [];
        if (requests.nonSmoking) selectedRequests.push("Phòng không hút thuốc");
        if (requests.connectingRoom) selectedRequests.push("Phòng liên thông");
        if (requests.highFloor) selectedRequests.push("Tầng lầu");

        if (selectedRequests.length === 0) {
            return <span className="request-value">-</span>;
        }
        return (
            <span className="request-value">
                {selectedRequests.join(', ')}
            </span>
        );
    };

    return (
        <Card className="payment-summary"> 
            <div className="payment-summary-header">
                <div className="header-icon-wrapper"><Receipt size={24} color="#007bff" /> </div>
                <div><strong>Tóm tắt khách sạn</strong><span className="booking-id">Mã đặt chỗ: 1301588167</span></div>
            </div>
            <div className="payment-summary-section hotel-info">
                <h4 className="font-semibold text-lg">{hotel.name}</h4>
            </div>
            <div className="payment-summary-section">
                <div className="time-details-payment">
                    <div className="time-block-payment"><span>Nhận phòng</span><strong>CN, 16 Th11 2025</strong><span>Từ 14:00</span></div>
                    <div className="duration-payment">{nights} đêm</div>
                    <div className="time-block-payment"><span>Trả phòng</span><strong>T2, 17 Th11 2025</strong><span>Trước 12:00</span></div>
                </div>
            </div>

            <div className="payment-summary-section room-details-list">
                <h4>(1x) {room.name}</h4>
                <div className="detail-item"><Users size={16} /><span>{room.guests} khách</span></div>
                <div className="detail-item"><BedDouble size={16} /><span>{room.beds}</span></div>
                <div className="detail-item"><Coffee size={16} /><span>Bữa sáng cho 2 người</span></div>
                <div className="detail-item"><Wifi size={16} /><span>WiFi miễn phí</span></div>

                <h5 className="request-title">Yêu cầu đặc biệt (nếu có)</h5>
                {renderSpecialRequests()}
            </div>

            <div className="payment-summary-section guest-details">
                <h4>Tên khách</h4>
                <div className="detail-item">
                    <span>{guestDetails?.guestName || '(Chưa nhập)'}</span>
                </div>
                <div className="policy-list">
                    <div className="policy-item"><Ban size={16} /><span>Không hoàn tiền</span></div>
                    <div className="policy-item"><Ban size={16} /><span>Không đổi lịch</span></div>
                </div>
            </div>
            <Divider className="my-0" />
            <div className="payment-summary-section contact-details">
                <h4>Chi tiết người liên lạc</h4>
                <div className="detail-item"><User size={16} /><span>{guestDetails?.contact?.fullName || '(Chưa nhập)'}</span></div>
                <div className="detail-item"><Phone size={16} /><span>{guestDetails?.contact?.phone || '(Chưa nhập)'}</span></div>
                <div className="detail-item"><Mail size={16} /><span>{guestDetails?.contact?.email || '(Chưa nhập)'}</span></div>
            </div>
        </Card>
    );
};

/* ----------------------------------------
   DISCOUNT (Giữ nguyên)
---------------------------------------- */
const DiscountSection = ({ onApply }) => {
    const [coupon, setCoupon] = useState('');
    return (
        <div className="form-section discount-section">
            <div className="form-header"><Tag size={20} className="form-header-icon" /><h2>Thêm mã giảm giá</h2><a href="#" className="read-more-link ml-auto">Thêm mã</a></div>
            <p className="form-description">Enter coupon code or select available coupon(s)</p>
            <div className="discount-input-group">
                <input type="text" placeholder="Nhập mã giảm giá" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="form-input" />
                <Button onClick={() => onApply(coupon)}>Áp dụng</Button>
            </div>
        </div>
    );
};

/* ----------------------------------------
   TOTAL PRICE (Giữ nguyên)
---------------------------------------- */
const TotalPriceSection = ({ totalPrice, onSubmit }) => {
    return (
        <div className="form-section total-price-section">
            <div><span className="total-price-label">Tổng giá tiền</span><h3 className="total-price-amount">{totalPrice.toLocaleString('vi-VN')}₫</h3></div>
            <Button size="lg" onClick={onSubmit} className="payment-submit-button">Thanh toán & Hiển thị mã QR</Button>
            <p className="payment-terms-text nowrap">Bằng cách tiếp tục thanh toán, bạn đã đồng ý&nbsp;<a href="#">Điều khoản & Điều kiện</a>&nbsp;và&nbsp;<a href="#">Chính sách quyền riêng tư</a>.</p>
        </div>
    );
};

/* ----------------------------------------
   MAIN COMPONENT
---------------------------------------- */
export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const { bookingData } = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [discountCode, setDiscountCode] = useState(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    if (!bookingData || !bookingData.room || !bookingData.hotel) {
        return (
                <div className="text-center py-20 max-w-7xl mx-auto px-6">
                    <h1 className="text-2xl font-bold mb-4">Lỗi</h1><p className="text-gray-600 mb-6">Không tìm thấy thông tin đặt phòng.</p><Button onClick={() => navigate('/hotels')}>Quay về trang chủ</Button>
                </div>
        );
    }

    const totalPrice = bookingData.room.price * 1;

    const handlePaymentSubmit = () => {
        setIsModalOpen(true);
    };

    const handleShowSuccess = () => {
        setIsModalOpen(false);
        setIsSuccessOpen(true);
    };

    return (
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* ✅ MỚI: Nút quay lại y hệt trang trước */}
                <Button
                    variant="ghost"
                onClick={() => {
                    // Thay vì navigate(-1), ta gửi lại toàn bộ dữ liệu về trang Booking
                    navigate('/booking', { 
                        state: { 
                            hotel: bookingData.hotel, 
                            room: bookingData.room, 
                            // Quan trọng: Trả lại dữ liệu khách đã nhập
                            guestDetails: bookingData.guestDetails 
                        } 
                    });
                }}
                leftIcon={<ArrowLeft size={18} />}
                className="mb-4"
            >
                Quay lại
                </Button>

                <h1 className="text-3xl font-bold mb-2 text-gray-800">Bạn muốn thanh toán thế nào?</h1>
                <p className="text-gray-600 mb-8">Thanh toán an toàn</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <PaymentForm onChange={setPaymentMethod} />
                        <DiscountSection onApply={(code) => setDiscountCode(code)} />
                        
                        <TotalPriceSection 
                            totalPrice={totalPrice} 
                            onSubmit={handlePaymentSubmit}
                        />
                    </div>

                    <div className="lg:col-span-1 sticky top-24 h-fit">
                        <PaymentSummary bookingData={bookingData} />
                    </div>
                </div>

                <QRCodeModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onConfirm={handleShowSuccess} 
                />

                <SuccessModal 
                    isOpen={isSuccessOpen} 
                    onClose={() => setIsSuccessOpen(false)} 
                />
            </main>
    );
}