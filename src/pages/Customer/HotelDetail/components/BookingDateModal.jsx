import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { Info, CalendarDays, ArrowRight, Check } from "lucide-react";
import { DateRange } from 'react-date-range';
import { vi } from 'date-fns/locale';
import { addDays, differenceInCalendarDays, format } from 'date-fns';

// Import CSS
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';

const BookingDateModal = ({ open, onClose, onConfirm, occupiedDates = [], roomPrice }) => {
    const [selection, setSelection] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
    });

    // State để điều chỉnh số tháng hiển thị dựa trên độ rộng màn hình
    const [monthsToShow, setMonthsToShow] = useState(2);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setMonthsToShow(1); // Mobile/Tablet: 1 tháng
            } else {
                setMonthsToShow(2); // Desktop rộng: 2 tháng
            }
        };
        
        handleResize(); // Chạy ngay lần đầu
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Tính toán
    const nights = Math.max(1, differenceInCalendarDays(selection.endDate, selection.startDate));
    const totalPrice = (roomPrice || 0) * nights;

    // Logic chặn ngày
    const checkDisabledDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return true;

        return occupiedDates.some(range => {
            const start = new Date(range.start);
            const end = new Date(range.end);
            start.setHours(0,0,0,0);
            end.setHours(0,0,0,0);
            return date >= start && date <= end;
        });
    };

    const handleConfirm = () => {
        onConfirm([selection.startDate, selection.endDate]);
    };

    return (
        <Modal 
            open={open} 
            onClose={onClose} 
            title="Chọn lịch trình chuyến đi" 
            maxWidth="max-w-7xl" // ✅ TĂNG KÍCH THƯỚC LÊN MỨC LỚN NHẤT
        >
            <div className="flex flex-col h-full bg-white max-h-[85vh] overflow-hidden">
                
                {/* 1. Header Cảnh báo nhỏ */}
                <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-start gap-3 shrink-0">
                    <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-blue-800">
                        <span className="font-semibold">Lưu ý:</span> Những ngày hiển thị màu xám là ngày đã hết phòng.
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    
                    {/* 2. CỘT TRÁI: LỊCH CHỌN NGÀY */}
                    <div className="flex-1 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-100 flex justify-center bg-gray-50/30 overflow-y-auto custom-scrollbar">
                        <div className="w-full flex justify-center">
                            <DateRange
                                onChange={item => setSelection(item.selection)}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={monthsToShow} // ✅ Responsive số tháng
                                ranges={[selection]}
                                direction="horizontal"
                                minDate={new Date()}
                                rangeColors={['#28A9E0']}
                                locale={vi}
                                disabledDay={checkDisabledDate}
                                dateDisplayFormat="dd/MM/yyyy"
                                className="booking-calendar-custom border border-gray-200 rounded-xl shadow-sm bg-white"
                            />
                        </div>
                    </div>

                    {/* 3. CỘT PHẢI: TÓM TẮT & HÀNH ĐỘNG */}
                    <div className="w-full lg:w-96 bg-white p-6 flex flex-col gap-6 shadow-[-4px_0px_10px_rgba(0,0,0,0.02)] z-10 shrink-0 overflow-y-auto">
                        
                        {/* Box hiển thị ngày */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Thời gian lưu trú</h4>
                            
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                {/* Ngày nhận */}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Nhận phòng</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <CalendarDays size={20} />
                                        </div>
                                        <div>
                                            <span className="block text-lg font-bold text-gray-800 leading-tight">
                                                {format(selection.startDate, "dd/MM/yyyy")}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">Từ 14:00</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Divider mũi tên */}
                                <div className="w-full h-px bg-gray-100 relative my-2">
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-300">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>

                                {/* Ngày trả */}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Trả phòng</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                            <CalendarDays size={20} />
                                        </div>
                                        <div>
                                            <span className="block text-lg font-bold text-gray-800 leading-tight">
                                                {format(selection.endDate, "dd/MM/yyyy")}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">Trước 12:00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Box tính tiền */}
                        <div className="flex-1 min-h-[100px]">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Chi tiết thanh toán</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Đơn giá phòng</span>
                                    <span className="font-medium">{new Intl.NumberFormat('vi-VN').format(roomPrice)}₫</span>
                                </div>
                                <div className="flex justify-between text-gray-600 items-center">
                                    <span>Số đêm lưu trú</span>
                                    <span className="font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-xs">x {nights} đêm</span>
                                </div>
                                <div className="border-t-2 border-dashed border-gray-100 my-2 pt-3 flex justify-between items-end">
                                    <span className="font-bold text-gray-800 text-base">Tổng tạm tính</span>
                                    <span className="text-2xl font-extrabold text-[rgb(40,169,224)]">
                                        {new Intl.NumberFormat('vi-VN').format(totalPrice)}₫
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 text-right italic">*Giá đã bao gồm thuế & phí</p>
                            </div>
                        </div>

                        {/* Nút bấm */}
                        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-gray-100">
                            <Button 
                                onClick={handleConfirm} 
                                className="w-full shadow-lg shadow-blue-200 bg-[rgb(40,169,224)] hover:bg-[#1b98d6] py-3.5 text-base font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                            >
                                <Check size={20} strokeWidth={3} /> Xác nhận đặt phòng
                            </Button>
                            <Button variant="ghost" onClick={onClose} className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                                Tôi muốn xem thêm
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BookingDateModal;