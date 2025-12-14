import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { Info, CalendarDays, ArrowRight, Check, TrendingUp, Sparkles } from "lucide-react";
import { DateRange } from 'react-date-range';
import { vi } from 'date-fns/locale';
import { addDays, differenceInCalendarDays, format, getDay } from 'date-fns';
// ✅ Import Recharts để vẽ biểu đồ
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

import roomService from "@/services/room.service";
import Spinner from "@/components/common/Loading/Spinner";

// Import CSS
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const BookingDateModal = ({ open, onClose, onConfirm, occupiedDates = [], selectedRoomId, roomPrice: initialRoomPrice, weekendPrice }) => {

    // Logic fallback: Nếu không có giá cuối tuần thì dùng giá thường
    const standardPrice = Number(initialRoomPrice) || 0;
    const endPrice = (weekendPrice && Number(weekendPrice) > 0) ? Number(weekendPrice) : standardPrice;

    // State lưu giá thực tế (lấy từ API Forecast để chính xác nhất)
    const [prices, setPrices] = useState({ weekday: standardPrice, weekend: endPrice });

    const [selection, setSelection] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
    });

    const [forecastData, setForecastData] = useState([]);
    const [loadingForecast, setLoadingForecast] = useState(false);
    const [monthsToShow, setMonthsToShow] = useState(2);
    const [hasPriceVariation, setHasPriceVariation] = useState(false);

    // Responsive: chỉnh số tháng hiển thị
    useEffect(() => {
        const handleResize = () => {
            setMonthsToShow(window.innerWidth < 1024 ? 1 : 2);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 1. Gọi API lấy Forecast (Dữ liệu biểu đồ)
    useEffect(() => {
        const fetchPriceForecast = async () => {
            if (!selectedRoomId || !open) return;
            setLoadingForecast(true);
            try {
                const res = await roomService.getPriceForecast(selectedRoomId, 14);
                if (res.data) {
                    const apiData = res.data;

                    // Lấy giá chính xác từ dữ liệu trả về
                    const pWeekday = apiData.find(d => (d.weekend !== undefined ? !d.weekend : !d.isWeekend))?.price || standardPrice;
                    const pWeekend = apiData.find(d => (d.weekend !== undefined ? d.weekend : d.isWeekend))?.price || endPrice;

                    setPrices({ weekday: Number(pWeekday), weekend: Number(pWeekend) });
                    setHasPriceVariation(Number(pWeekday) !== Number(pWeekend));

                    // Map dữ liệu cho Recharts
                    const formattedData = apiData.map(item => {
                        const isWknd = item.weekend !== undefined ? item.weekend : item.isWeekend;
                        const maxP = Math.max(Number(pWeekday), Number(pWeekend));
                        let savings = 0;
                        // Tính % rẻ hơn
                        if (!isWknd && item.price < maxP && maxP > 0) {
                            savings = Math.round(((maxP - item.price) / maxP) * 100);
                        }

                        return {
                            date: new Date(item.date),
                            dayName: format(new Date(item.date), "EEEE", { locale: vi }).replace("Thứ ", "T"),
                            fullDateStr: format(new Date(item.date), "dd/MM"),
                            price: item.price,
                            level: isWknd ? 'weekend' : 'weekday',
                            savings: savings,
                            isWeekend: isWknd
                        };
                    });
                    setForecastData(formattedData);
                }
            } catch (error) {
                console.error("Lỗi forecast:", error);
            } finally {
                setLoadingForecast(false);
            }
        };
        fetchPriceForecast();
    }, [selectedRoomId, open]);

    // 2. Logic tính tiền chi tiết (Ngày thường vs Cuối tuần)
    const bookingCalculation = useMemo(() => {
        let total = 0;
        let weekdayCount = 0;
        let weekendCount = 0;
        let tempDate = new Date(selection.startDate);
        const endDate = new Date(selection.endDate);

        // Reset giờ để so sánh ngày chính xác
        tempDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);

        while (tempDate < endDate) {
            const dayOfWeek = getDay(tempDate); // 0=CN, 6=T7
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            if (isWeekend) {
                total += prices.weekend;
                weekendCount++;
            } else {
                total += prices.weekday;
                weekdayCount++;
            }
            tempDate = addDays(tempDate, 1);
        }
        const nights = Math.max(1, differenceInCalendarDays(selection.endDate, selection.startDate));
        return { total, nights, weekdayCount, weekendCount, prices };
    }, [selection, prices]);

    const handleConfirm = () => {
        // ✅ Gửi kèm kết quả tính toán (calculationData) ra ngoài
        onConfirm([selection.startDate, selection.endDate], bookingCalculation);
    };

    // Tooltip tùy chỉnh cho biểu đồ
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl text-xs z-50">
                    <div className="font-bold text-gray-700 mb-1">{data.dayName}, {data.fullDateStr}</div>
                    <div className="text-base font-extrabold text-blue-600 mb-1">
                        {new Intl.NumberFormat('vi-VN').format(data.price)}₫
                    </div>
                    {data.savings > 0 && <div className="text-green-600 font-medium">Rẻ hơn {data.savings}% so với cuối tuần</div>}
                </div>
            );
        }
        return null;
    };

    // Logic chặn ngày (Giữ nguyên)
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

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Lên lịch chuyến đi"
            maxWidth="max-w-7xl"
        >
            <div className="flex flex-col h-full bg-white max-h-[90vh] overflow-hidden">

                {/* Header Tip */}
                <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-start gap-3 shrink-0">
                    <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-blue-800">
                        {hasPriceVariation ? (
                            <span><span className="font-semibold">Mẹo thông minh:</span> Đặt phòng vào các ngày <span className="font-bold text-green-600">Trong tuần (Xanh lá)</span> để có giá tốt nhất!</span>
                        ) : (
                            <span><span className="font-semibold">Lưu ý:</span> Những ngày hiển thị màu xám là ngày đã hết phòng.</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

                    {/* CỘT TRÁI: LỊCH VÀ BIỂU ĐỒ */}
                    <div className="flex-1 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col items-center bg-gray-50/30 overflow-y-auto custom-scrollbar">

                        <div className="w-full flex justify-center mb-6">
                            <DateRange
                                onChange={item => setSelection(item.selection)}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={monthsToShow}
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

                        {/* ✅ CHART KHU VỰC - Thêm mới vào đây */}
                        <div className="w-full max-w-4xl bg-white p-4 rounded-2xl border border-gray-200 shadow-sm min-h-[220px]">
                            {loadingForecast ? (
                                <div className="flex justify-center h-44 items-center"><Spinner size="md"/></div>
                            ) : (
                                <div className="h-44 w-full">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="text-sm font-bold text-gray-700 flex gap-2"><TrendingUp size={16}/> Dự báo giá</h4>
                                        <div className="flex gap-3 text-[10px] font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                            {hasPriceVariation ? (
                                                <>
                                                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></span> Trong tuần</div>
                                                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm"></span> Cuối tuần</div>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm"></span> Giá tiêu chuẩn</div>
                                            )}
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={forecastData}
                                            margin={{top:5, right:0, left:-20, bottom:0}}
                                            onClick={(d) => d && d.activePayload && setSelection({
                                                startDate: d.activePayload[0].payload.date,
                                                endDate: addDays(d.activePayload[0].payload.date, 1),
                                                key:'selection'
                                            })}
                                        >
                                            <defs>
                                                <linearGradient id="colorWk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e"/><stop offset="100%" stopColor="#86efac"/></linearGradient>
                                                <linearGradient id="colorEnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#fdba74"/></linearGradient>
                                                <linearGradient id="colorSt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#93c5fd"/></linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                            <XAxis dataKey="dayName" axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#64748b'}} dy={5}/>
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize:10, fill:'#94a3b8'}} tickFormatter={v => `${v/1000}k`}/>
                                            <Tooltip content={<CustomTooltip/>} cursor={{fill:'rgba(0,0,0,0.05)', radius:4}}/>
                                            <Bar dataKey="price" radius={[4,4,0,0]} maxBarSize={40}>
                                                {forecastData.map((e, i) => {
                                                    let fillUrl = "url(#colorSt)";
                                                    if (hasPriceVariation) {
                                                        if (e.isWeekend) fillUrl = "url(#colorEnd)";
                                                        else fillUrl = "url(#colorWk)";
                                                    }

                                                    // Highlight ngày đang chọn
                                                    const isSelected = e.date >= selection.startDate && e.date < selection.endDate;

                                                    return (
                                                        <Cell
                                                            key={i}
                                                            fill={fillUrl}
                                                            stroke={isSelected ? '#2563eb' : 'none'}
                                                            strokeWidth={isSelected ? 2 : 0}
                                                            style={{ opacity: isSelected ? 1 : 0.8 }}
                                                        />
                                                    );
                                                })}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. CỘT PHẢI: SUMMARY (Cập nhật hiển thị giá chi tiết) */}
                    <div className="w-full lg:w-96 bg-white p-6 flex flex-col gap-6 shadow-[-4px_0px_10px_rgba(0,0,0,0.02)] z-10 shrink-0 overflow-y-auto">

                        {/* Box hiển thị ngày (Giữ nguyên) */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Thời gian lưu trú</h4>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Nhận phòng</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><CalendarDays size={20} /></div>
                                        <div>
                                            <span className="block text-lg font-bold text-gray-800 leading-tight">{format(selection.startDate, "dd/MM/yyyy")}</span>
                                            <span className="text-xs text-gray-400 font-medium">Từ 14:00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-px bg-gray-100 relative my-2">
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-300"><ArrowRight size={16} /></div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Trả phòng</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600"><CalendarDays size={20} /></div>
                                        <div>
                                            <span className="block text-lg font-bold text-gray-800 leading-tight">{format(selection.endDate, "dd/MM/yyyy")}</span>
                                            <span className="text-xs text-gray-400 font-medium">Trước 12:00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Box tính tiền (Update logic hiển thị) */}
                        <div className="flex-1 min-h-[100px]">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Chi tiết thanh toán</h4>
                            <div className="space-y-3 text-sm">
                                {bookingCalculation.weekdayCount > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Ngày thường ({new Intl.NumberFormat('vi-VN').format(prices.weekday)}₫)</span>
                                        <span className="font-medium">x {bookingCalculation.weekdayCount} đêm</span>
                                    </div>
                                )}
                                {bookingCalculation.weekendCount > 0 && (
                                    <div className="flex justify-between text-orange-600 font-medium">
                                        <span>Cuối tuần ({new Intl.NumberFormat('vi-VN').format(prices.weekend)}₫)</span>
                                        <span>x {bookingCalculation.weekendCount} đêm</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600 items-center pt-2 border-t border-gray-100">
                                    <span>Tổng số đêm</span>
                                    <span className="font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-xs">{bookingCalculation.nights} đêm</span>
                                </div>

                                <div className="border-t-2 border-dashed border-gray-100 my-2 pt-3 flex justify-between items-end">
                                    <span className="font-bold text-gray-800 text-base">Tổng tạm tính</span>
                                    <span className="text-2xl font-extrabold text-[rgb(40,169,224)]">
                                        {new Intl.NumberFormat('vi-VN').format(bookingCalculation.total)}₫
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