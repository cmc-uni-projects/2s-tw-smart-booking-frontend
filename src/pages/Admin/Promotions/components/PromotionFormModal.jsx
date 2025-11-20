import React, { useState, useEffect, useRef } from "react";
import {
    X, Tag, Calendar, Percent, DollarSign,
    Layers, Hash, CheckCircle2, AlertCircle
} from "lucide-react";

// --- COMPONENT CON: CUSTOM INPUT ---
const CustomInput = ({ label, name, value, onChange, type = "text", placeholder, icon: Icon, error, disabled }) => {
    const inputRef = useRef(null);
    const handleIconClick = () => {
        if (type === 'date' && inputRef.current) {
            if (inputRef.current.showPicker) inputRef.current.showPicker();
            else inputRef.current.focus();
        }
    };

    return (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">
                {label} {error && <span className="text-red-500">*</span>}
            </label>
            <div className="relative group">
                {Icon && (
                    <div
                        onClick={handleIconClick}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 transition-all duration-200 z-10
              ${type === 'date' ? 'cursor-pointer hover:bg-blue-50 p-1.5 rounded-lg' : 'pointer-events-none pl-2'}
            `}
                    >
                        <Icon
                            size={type === 'date' ? 20 : 18}
                            className={type === 'date' ? "text-[rgb(40,169,224)]" : "text-gray-400 group-focus-within:text-blue-500"}
                            strokeWidth={type === 'date' ? 2.5 : 2}
                        />
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
                    className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none transition-all duration-200
            ${error
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white'
                    }
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            [&::-webkit-calendar-picker-indicator]:hidden
            [&::-webkit-inner-spin-button]:appearance-none
          `}
                />
            </div>
            {error && <p className="text-xs text-red-500 flex items-center gap-1 ml-1"><AlertCircle size={12}/> {error}</p>}
        </div>
    );
};

// --- COMPONENT CON: CUSTOM SELECT ---
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
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4"/></svg>
            </div>
        </div>
    </div>
);

// --- MAIN COMPONENT ---
const PromotionFormModal = ({ open, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        type: "PERCENT",
        value: "",
        quantity: "",
        minOrder: "",
        maxDiscount: "",
        startDate: "",
        endDate: "",
        isActive: true,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            setErrors({});
            if (initialData) {
                const { target, ...rest } = initialData;
                setFormData({
                    ...rest,
                    isActive: rest.isActive !== undefined ? rest.isActive : true
                });
            } else {
                setFormData({
                    code: "",
                    name: "",
                    type: "PERCENT",
                    value: "",
                    quantity: 100,
                    minOrder: 0,
                    maxDiscount: 0,
                    startDate: "",
                    endDate: "",
                    isActive: true,
                });
            }
        }
    }, [open, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const toggleStatus = () => {
        setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.code.trim()) newErrors.code = "Mã không được để trống";
        else if (formData.code.length < 3) newErrors.code = "Mã phải ít nhất 3 ký tự";
        if (!formData.name.trim()) newErrors.name = "Tên chương trình là bắt buộc";
        if (!formData.value) newErrors.value = "Nhập giá trị giảm";
        else if (Number(formData.value) <= 0) newErrors.value = "Giá trị phải lớn hơn 0";
        if (formData.type === 'PERCENT' && Number(formData.value) > 100) newErrors.value = "Giảm giá % không quá 100%";
        if (!formData.startDate) newErrors.startDate = "Chọn ngày bắt đầu";
        if (!formData.endDate) newErrors.endDate = "Chọn ngày kết thúc";
        if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
            newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all scale-100 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[rgb(40,169,224)] to-[rgb(26,140,189)] text-white">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            {initialData ? <CheckCircle2 size={22}/> : <Tag size={22}/>}
                            {initialData ? "Cập nhật Khuyến mãi" : "Tạo Khuyến mãi Mới"}
                        </h3>
                        <p className="text-blue-100 text-xs mt-1 opacity-90">Điền đầy đủ thông tin để kích hoạt mã giảm giá.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="sm:col-span-1">
                            <CustomInput label="Mã Code (Voucher)" name="code" value={formData.code} onChange={handleChange} placeholder="VD: SALE50" icon={Tag} error={errors.code} />
                        </div>
                        <div className="sm:col-span-2">
                            <CustomInput label="Tên chương trình" name="name" value={formData.name} onChange={handleChange} placeholder="VD: Siêu sale tháng 11" icon={CheckCircle2} error={errors.name} />
                        </div>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <CustomSelect label="Loại giảm giá" name="type" value={formData.type} onChange={handleChange} icon={Layers}
                                      options={[ { value: "PERCENT", label: "Giảm theo % (Phần trăm)" }, { value: "FIXED", label: "Giảm giá cố định (VNĐ)" } ]}
                        />
                        <CustomInput label={formData.type === 'PERCENT' ? "Mức giảm (%)" : "Số tiền (VNĐ)"} name="value" type="number" value={formData.value} onChange={handleChange} placeholder={formData.type === 'PERCENT' ? "VD: 20" : "VD: 50000"} icon={formData.type === 'PERCENT' ? Percent : DollarSign} error={errors.value} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <CustomInput label="Đơn tối thiểu" name="minOrder" type="number" value={formData.minOrder} onChange={handleChange} icon={DollarSign} placeholder="0" />
                        {formData.type === 'PERCENT' ? (
                            <CustomInput label="Giảm tối đa" name="maxDiscount" type="number" value={formData.maxDiscount} onChange={handleChange} icon={DollarSign} placeholder="VD: 200000" />
                        ) : (
                            <div className="opacity-50"><CustomInput label="Giảm tối đa" value="-" disabled /></div>
                        )}
                        <CustomInput label="Số lượng mã" name="quantity" type="number" value={formData.quantity} onChange={handleChange} icon={Hash} placeholder="100" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <CustomInput label="Ngày bắt đầu" name="startDate" type="date" value={formData.startDate} onChange={handleChange} icon={Calendar} error={errors.startDate} />
                        <CustomInput label="Ngày kết thúc" name="endDate" type="date" value={formData.endDate} onChange={handleChange} icon={Calendar} error={errors.endDate} />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">

                    {/* Toggle Switch */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={toggleStatus}
                    >
                        <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                        <span className={`font-medium text-sm ${formData.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {formData.isActive ? "Đang hoạt động" : "Đang tạm dừng"}
              </span>
                    </div>

                    {/* Button chính */}
                    <div>
                        <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-[rgb(40,169,224)] text-white font-semibold shadow-lg shadow-blue-200 hover:bg-[rgb(26,140,189)] hover:shadow-none transition-all transform active:scale-95">
                            {/* ✅ ĐỔI TÊN Ở ĐÂY: initialData ? "Lưu thay đổi" : "Thêm" */}
                            {initialData ? "Lưu thay đổi" : "Thêm"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PromotionFormModal;