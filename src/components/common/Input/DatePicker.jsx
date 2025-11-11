// src/components/common/Input/DatePicker.jsx
import React, { useRef } from "react"; // 1. Import useRef
import { Calendar } from "lucide-react"; // 2. Import lại Calendar

export default function DatePicker({ label, value, onChange }) {

    // 3. Tạo một ref để tham chiếu đến input
    const inputRef = useRef(null);

    // 4. Tạo hàm để "ra lệnh" cho input mở lịch
    const handleIconClick = () => {
        if (inputRef.current) {
            try {
                // Hàm chuẩn của trình duyệt để mở cửa sổ chọn ngày
                inputRef.current.showPicker();
            } catch (e) {
                console.error("Trình duyệt này không hỗ trợ showPicker().");
            }
        }
    };

    return (
        <div className="flex flex-col w-full">
            {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
            <div className="relative">

                {/* 5. THÊM LẠI ICON TĨNH (NHƯNG DÙNG <button>) */}
                <button
                    type="button"
                    onClick={handleIconClick}
                    // ✅ 6. THAY ĐỔI: Thêm màu xanh (nổi bật) và hover
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(40,169,224)] cursor-pointer p-1"
                    tabIndex={-1} // Để không bị focus khi bấm Tab
                >
                    <Calendar size={18} />
                </button>

                <input
                    ref={inputRef} // 7. Gán ref vào input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}

                    // ✅ 8. SỬA LẠI PADDING:
                    // 'pl-10' (chừa 10 padding bên trái cho icon)
                    // 'pr-4' (chừa 4 padding bên phải)
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-700 shadow-sm focus:border-[rgb(40,169,224)] focus:ring-2 focus:ring-[rgb(40,169,224,0.2)] transition-all"
                />

            </div>
        </div>
    );
}