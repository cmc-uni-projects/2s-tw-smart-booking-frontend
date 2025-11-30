import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
    X, Tag, Percent, DollarSign,
    Layers, Hash, CheckCircle2, AlertCircle, Clock, Calendar, Upload, Image as ImageIcon,
    Crown // [MỚI] Import icon vương miện cho Rank
} from "lucide-react";
import promotionService from "../../../../services/promotion.service";
import toast from "react-hot-toast";
import Toast from "@/components/common/Notification/Toast";

// --- CONFIG: URL hiển thị ảnh từ Backend ---
const BE_BASE_URL = "http://127.0.0.1:8386";
const UPLOAD_DIR = "/uploads/";

// Helper hiển thị Toast đồng bộ giao diện
const showToast = (type, message) => {
    toast.custom((t) => (
        <Toast type={type} message={message} onClose={() => toast.dismiss(t.id)} />
    ), {
        duration: 3000,
        position: 'bottom-center'
    });
};

// --- 1. CustomInput (Giữ nguyên) ---
const CustomInput = ({ label, name, value, onChange, type = "text", placeholder, icon: Icon, error, disabled, className, ...props }) => {
    const inputRef = useRef(null);

    const handleIconClick = () => {
        if (type === 'date' && inputRef.current) {
            if (inputRef.current.showPicker) {
                inputRef.current.showPicker();
            } else {
                inputRef.current.focus();
            }
        }
    };

    const isDateInput = type === 'date';

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-gray-700 ml-1">
                    {label} {error && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div
                        onClick={handleIconClick}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 transition-all duration-200 z-10 pl-2 rounded-lg p-1.5
                            ${isDateInput
                            ? 'cursor-pointer pointer-events-auto text-[rgb(40,169,224)] hover:bg-blue-50'
                            : 'pointer-events-none text-gray-400 group-focus-within:text-blue-500'
                        }`}
                    >
                        <Icon size={18} strokeWidth={isDateInput ? 2.5 : 2} />
                    </div>
                )}
                <input
                    ref={inputRef}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    {...props}
                    className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none transition-all duration-200 ${error ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white'} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} placeholder-gray-400 selection:bg-blue-100 [&::-webkit-calendar-picker-indicator]:hidden`}
                />
            </div>
            {error && <p className="text-xs text-red-500 flex items-center gap-1 ml-1"><AlertCircle size={12}/> {error}</p>}
        </div>
    );
};

// --- 2. CustomSelect (Giữ nguyên) ---
const CustomSelect = ({ label, name, value, onChange, options, icon: Icon }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
        <div className="relative group">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Icon size={18} />
                </div>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white`}
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4"/></svg>
            </div>
        </div>
    </div>
);

// --- 3. TimePicker (Giữ nguyên) ---
const TimePicker = ({ value, onChange, error }) => {
    const [hour, setHour] = useState("00");
    const [minute, setMinute] = useState("00");

    useEffect(() => {
        if (value && value.includes(':')) {
            const [h, m] = value.split(':');
            setHour(h);
            setMinute(m);
        }
    }, [value]);

    const handleChangeInput = (e, type) => {
        const val = e.target.value;
        if (!/^\d{0,2}$/.test(val)) return;

        if (type === 'hour') setHour(val);
        else setMinute(val);
    };

    const handleBlur = (type) => {
        let val = type === 'hour' ? hour : minute;
        if (!val) val = "00";
        if (val.length === 1) val = "0" + val;

        const num = parseInt(val, 10);
        if (type === 'hour') {
            if (num > 23) val = "23";
        } else {
            if (num > 59) val = "59";
        }

        if (type === 'hour') {
            setHour(val);
            onChange(`${val}:${minute}`);
        } else {
            setMinute(val);
            onChange(`${hour}:${val}`);
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };

    return (
        <div className={`flex items-center border rounded-xl bg-gray-50 px-3 py-2.5 transition-all duration-200 ${error ? 'border-red-300 ring-4 ring-red-100 bg-red-50' : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:bg-white'}`}>
            <div className="text-gray-400 mr-2"><Clock size={18} strokeWidth={2} /></div>
            <input
                type="text"
                value={hour}
                onChange={(e) => handleChangeInput(e, 'hour')}
                onBlur={() => handleBlur('hour')}
                onFocus={handleFocus}
                placeholder="HH"
                className="bg-transparent outline-none text-gray-700 font-semibold w-8 text-center placeholder-gray-300 focus:text-blue-600 selection:bg-blue-200"
            />
            <span className="text-gray-400 font-bold mx-1">:</span>
            <input
                type="text"
                value={minute}
                onChange={(e) => handleChangeInput(e, 'minute')}
                onBlur={() => handleBlur('minute')}
                onFocus={handleFocus}
                placeholder="MM"
                className="bg-transparent outline-none text-gray-700 font-semibold w-8 text-center placeholder-gray-300 focus:text-blue-600 selection:bg-blue-200"
            />
        </div>
    );
};

// --- 4. Main Component ---
const PromotionFormModal = ({ open, onClose, onSuccess, initialData }) => {
    const [formData, setFormData] = useState({
        code: "", name: "", type: "PERCENT", value: "", quantity: "", minOrder: "", maxDiscount: "",
        startDate: "", endDate: "", isActive: true,
        minMembershipRank: "BRONZE" // [MỚI] Mặc định là Đồng
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // State cho Upload Banner
    const [bannerFile, setBannerFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Helper ghép URL ảnh đầy đủ từ Backend
    const getFullImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${BE_BASE_URL}${UPLOAD_DIR}${cleanPath}`;
    };

    const normalizeDateTime = (dateInput) => {
        if (!dateInput) return "";
        if (Array.isArray(dateInput)) {
            const [y, m, d, h=0, min=0] = dateInput;
            return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        }
        if (dateInput instanceof Date) {
            const y = dateInput.getFullYear();
            const m = String(dateInput.getMonth() + 1).padStart(2, '0');
            const d = String(dateInput.getDate()).padStart(2, '0');
            const h = String(dateInput.getHours()).padStart(2, '0');
            const min = String(dateInput.getMinutes()).padStart(2, '0');
            return `${y}-${m}-${d}T${h}:${min}`;
        }
        if (typeof dateInput === 'string') {
            if (dateInput.includes('T')) return dateInput.substring(0, 16);
            return `${dateInput}T00:00`;
        }
        return "";
    };

    useEffect(() => {
        if (open) {
            setErrors({});
            setBannerFile(null);
            if (initialData) {
                const { target, ...rest } = initialData;
                setFormData({
                    ...rest,
                    startDate: normalizeDateTime(rest.startDate),
                    endDate: normalizeDateTime(rest.endDate),
                    isActive: rest.isActive !== undefined ? rest.isActive : true,
                    // [MỚI] Lấy rank từ dữ liệu sửa, nếu không có thì mặc định Bronze
                    minMembershipRank: rest.minMembershipRank || "BRONZE"
                });
                setPreviewUrl(getFullImageUrl(rest.bannerUrl));
            } else {
                setFormData({
                    code: "", name: "", type: "PERCENT", value: "", quantity: 100, minOrder: 0, maxDiscount: 0,
                    startDate: "", endDate: "", isActive: true,
                    minMembershipRank: "BRONZE" // [MỚI] Reset về Bronze khi tạo mới
                });
                setPreviewUrl(null);
            }
        }
    }, [open, initialData]);

    // Cleanup URL preview khi unmount hoặc modal đóng
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // Check size 5MB
                showToast("error", "Ảnh quá lớn (Max 5MB)");
                return;
            }
            setBannerFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleImageError = () => {
        if (previewUrl) {
            setPreviewUrl(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSplitDateTimeChange = (field, type, value) => {
        setFormData(prev => {
            const currentFull = prev[field] || "";
            const [currentDate, currentTime] = currentFull.includes('T') ? currentFull.split('T') : ["", "00:00"];

            let newDate = currentDate;
            let newTime = currentTime || "00:00";

            if (type === 'date') newDate = value;
            else if (type === 'time') newTime = value;

            if (newDate) {
                const newFull = `${newDate}T${newTime}`;
                if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
                return { ...prev, [field]: newFull };
            }
            return prev;
        });
    };

    const getSplitValue = (dateTimeStr, type) => {
        if (!dateTimeStr) return "";
        const parts = dateTimeStr.split('T');
        if (type === 'date') return parts[0] || "";
        if (type === 'time') return parts[1] || "00:00";
        return "";
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.code.trim()) newErrors.code = "Mã không được để trống";
        if (!formData.name.trim()) newErrors.name = "Tên chương trình là bắt buộc";
        if (!formData.value) newErrors.value = "Nhập giá trị giảm";
        else if (Number(formData.value) <= 0) newErrors.value = "Giá trị phải lớn hơn 0";
        if (formData.type === 'PERCENT' && Number(formData.value) > 100) newErrors.value = "Giảm giá % không quá 100%";

        if (formData.minOrder && Number(formData.minOrder) < 0) newErrors.minOrder = "Số tiền không được âm";
        if (formData.maxDiscount && Number(formData.maxDiscount) < 0) newErrors.maxDiscount = "Số tiền không được âm";
        if (formData.quantity && Number(formData.quantity) <= 0) newErrors.quantity = "Số lượng phải lớn hơn 0";

        if (!formData.startDate) newErrors.startDate = "Chọn ngày giờ bắt đầu";
        else if (!formData.startDate.includes('T')) newErrors.startDate = "Thiếu thông tin giờ";

        if (!formData.endDate) newErrors.endDate = "Chọn ngày giờ kết thúc";
        else if (!formData.endDate.includes('T')) newErrors.endDate = "Thiếu thông tin giờ";

        if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
            newErrors.endDate = "Thời gian kết thúc phải sau bắt đầu";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setIsLoading(true);
            try {
                let promotionId;

                // BƯỚC 1: Lưu thông tin chữ
                if (initialData) {
                    // Update
                    promotionId = initialData.promotionId;
                    await promotionService.updatePromotion(promotionId, formData);
                } else {
                    // Create
                    const res = await promotionService.createPromotion(formData);
                    promotionId = res.data?.data?.promotionId || res.data?.promotionId;
                }

                // BƯỚC 2: Upload ảnh (Nếu có file mới)
                if (bannerFile && promotionId) {
                    await promotionService.uploadBanner(promotionId, bannerFile);
                }

                showToast("success", initialData ? "Cập nhật thành công!" : "Tạo khuyến mãi thành công!");
                if (onSuccess) onSuccess();
                onClose();
            } catch (error) {
                console.error(error);
                showToast("error", error.response?.data?.message || "Có lỗi xảy ra!");
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all scale-100 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[rgb(40,169,224)] to-[rgb(26,140,189)] text-white">
                    <div><h3 className="text-xl font-bold flex items-center gap-2">{initialData ? <CheckCircle2 size={22}/> : <Tag size={22}/>} {initialData ? "Cập nhật Khuyến mãi" : "Tạo Khuyến mãi Mới"}</h3><p className="text-blue-100 text-xs mt-1 opacity-90">Điền đầy đủ thông tin để kích hoạt mã giảm giá.</p></div>
                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">

                    {/* Banner Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Banner Khuyến Mãi</label>
                        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50/50 transition-colors relative overflow-hidden group">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Banner"
                                    className="w-full h-full object-contain z-10"
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <ImageIcon size={40} className="mb-2 opacity-50" />
                                    <span className="text-sm font-medium">Nhấn để tải ảnh lên</span>
                                    <span className="text-xs opacity-70">(JPG, PNG - Max 5MB)</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            {previewUrl && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                    <p className="text-white font-semibold flex items-center gap-2"><Upload size={18}/> Thay đổi ảnh</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="sm:col-span-1"><CustomInput label="Mã Code" name="code" value={formData.code} onChange={handleChange} placeholder="VD: SALE50" icon={Tag} error={errors.code} /></div>
                        <div className="sm:col-span-2"><CustomInput label="Tên chương trình" name="name" value={formData.name} onChange={handleChange} placeholder="VD: Siêu sale tháng 11" icon={CheckCircle2} error={errors.name} /></div>
                    </div>

                    {/* [MỚI] Thêm phần chọn Hạng thành viên với label đã sửa */}
                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-5">
                        <CustomSelect
                            label="Đối tượng áp dụng (Hạng thành viên tối thiểu)"
                            name="minMembershipRank"
                            value={formData.minMembershipRank}
                            onChange={handleChange}
                            icon={Crown}
                            options={[
                                { value: "BRONZE", label: "Đồng (Tất cả thành viên)" },
                                { value: "SILVER", label: "Bạc (Silver - Chi tiêu > 1 triệu đồng)" },
                                { value: "GOLD", label: "Vàng (Gold - Chi tiêu > 5 triệu đồng)" },
                                { value: "DIAMOND", label: "Kim Cương (Diamond - Chi tiêu > 10 triệu đồng)" }
                            ]}
                        />
                        <p className="text-xs text-gray-500 mt-2 ml-1 italic">* Khuyến mãi này sẽ áp dụng cho các thành viên có hạng này trở lên.</p>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <CustomSelect label="Loại giảm giá" name="type" value={formData.type} onChange={handleChange} icon={Layers} options={[ { value: "PERCENT", label: "Giảm theo % (Phần trăm)" }, { value: "FIXED", label: "Giảm giá cố định (VNĐ)" } ]} />
                        <CustomInput label={formData.type === 'PERCENT' ? "Mức giảm (%)" : "Số tiền (VNĐ)"} name="value" type="number" value={formData.value} onChange={handleChange} placeholder={formData.type === 'PERCENT' ? "VD: 20" : "VD: 50000"} icon={formData.type === 'PERCENT' ? Percent : DollarSign} error={errors.value} min="0" onFocus={(e) => e.target.select()} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <CustomInput label="Đơn tối thiểu" name="minOrder" type="number" value={formData.minOrder} onChange={handleChange} icon={DollarSign} placeholder="0" min="0" onFocus={(e) => e.target.select()} error={errors.minOrder} />
                        {formData.type === 'PERCENT' ? (<CustomInput label="Giảm tối đa" name="maxDiscount" type="number" value={formData.maxDiscount} onChange={handleChange} icon={DollarSign} placeholder="VD: 200000" min="0" onFocus={(e) => e.target.select()} error={errors.maxDiscount} />) : (<div className="opacity-50"><CustomInput label="Giảm tối đa" value="-" disabled /></div>)}
                        <CustomInput label="Tổng số lượng" name="quantity" type="number" value={formData.quantity} onChange={handleChange} icon={Hash} placeholder="1000" min="1" onFocus={(e) => e.target.select()} error={errors.quantity} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Thời gian bắt đầu {errors.startDate && <span className="text-red-500">*</span>}</label>
                            <div className="flex gap-2">
                                <div className="w-3/5">
                                    <CustomInput type="date" value={getSplitValue(formData.startDate, 'date')} onChange={(e) => handleSplitDateTimeChange('startDate', 'date', e.target.value)} icon={Calendar} error={!!errors.startDate} />
                                </div>
                                <div className="w-2/5">
                                    <TimePicker value={getSplitValue(formData.startDate, 'time')} onChange={(newTime) => handleSplitDateTimeChange('startDate', 'time', newTime)} error={!!errors.startDate} />
                                </div>
                            </div>
                            {errors.startDate && <p className="text-xs text-red-500 flex items-center gap-1 ml-1 mt-1"><AlertCircle size={12}/> {errors.startDate}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Thời gian kết thúc {errors.endDate && <span className="text-red-500">*</span>}</label>
                            <div className="flex gap-2">
                                <div className="w-3/5">
                                    <CustomInput type="date" value={getSplitValue(formData.endDate, 'date')} onChange={(e) => handleSplitDateTimeChange('endDate', 'date', e.target.value)} icon={Calendar} error={!!errors.endDate} />
                                </div>
                                <div className="w-2/5">
                                    <TimePicker value={getSplitValue(formData.endDate, 'time')} onChange={(newTime) => handleSplitDateTimeChange('endDate', 'time', newTime)} error={!!errors.endDate} />
                                </div>
                            </div>
                            {errors.endDate && <p className="text-xs text-red-500 flex items-center gap-1 ml-1 mt-1"><AlertCircle size={12}/> {errors.endDate}</p>}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`px-6 py-2.5 rounded-xl bg-[rgb(40,169,224)] text-white font-semibold shadow-lg shadow-blue-200 hover:bg-[rgb(26,140,189)] hover:shadow-none transition-all transform active:scale-95 flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            initialData ? "Lưu thay đổi" : "Thêm"
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PromotionFormModal;