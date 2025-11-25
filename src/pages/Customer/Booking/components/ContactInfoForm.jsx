import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import MissingProfileModal from './MissingProfileModal';

const ContactInfoForm = ({ user, onChange, initialData }) => {
    // State form data
    const [formData, setFormData] = useState({
        fullName: initialData?.contactName || "",
        phone: initialData?.contactPhone || "",
        email: initialData?.contactEmail || "",
        specialRequest: initialData?.specialRequest || ""
    });

    // State logic "Đặt cho mình"
    const [isSelfBooking, setIsSelfBooking] = useState(false);
    const [missingFields, setMissingFields] = useState([]);
    const [showMissingModal, setShowMissingModal] = useState(false);

    // Cập nhật data lên cha mỗi khi form thay đổi
    useEffect(() => {
        onChange({ ...formData, isSelfBooking });
    }, [formData, isSelfBooking]);

    // Xử lý khi tích chọn "Đặt cho mình"
    const handleSelfBookingToggle = (e) => {
        const checked = e.target.checked;
        
        if (checked) {
            // 1. Kiểm tra thông tin user
            const missing = [];
            if (!user?.fullName) missing.push("Họ và tên");
            if (!user?.phoneNumber) missing.push("Số điện thoại");
            if (!user?.email) missing.push("Email");

            if (missing.length > 0) {
                // Thiếu -> Hiện modal & Reset checkbox
                setMissingFields(missing);
                setShowMissingModal(true);
                return;
            }

            // Đủ -> Auto fill & Disable input
            setFormData(prev => ({
                ...prev,
                fullName: user.fullName,
                phone: user.phoneNumber,
                email: user.email
            }));
            setIsSelfBooking(true);
        } else {
            // Bỏ chọn -> Clear form (giữ lại note) & Enable input
            setFormData(prev => ({
                ...prev,
                fullName: "",
                phone: "",
                email: ""
            }));
            setIsSelfBooking(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <User size={20} className="text-blue-600" /> Thông tin liên hệ
                </h3>
                
                {/* CHECKBOX ĐẶT CHO MÌNH */}
                {user && (
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            isSelfBooking ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300 group-hover:border-blue-400"
                        }`}>
                            {isSelfBooking && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={isSelfBooking} 
                            onChange={handleSelfBookingToggle}
                        />
                        <span className={`text-sm font-medium ${isSelfBooking ? "text-blue-700" : "text-slate-600"}`}>
                            Tôi đặt cho chính mình
                        </span>
                    </label>
                )}
            </div>

            <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* HỌ TÊN */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                            Họ và tên <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="fullName"
                                disabled={isSelfBooking}
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                                    isSelfBooking 
                                        ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" 
                                        : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                }`}
                                placeholder="VD: Nguyen Van A"
                            />
                        </div>
                    </div>

                    {/* SỐ ĐIỆN THOẠI */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                            Số điện thoại <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="phone"
                                disabled={isSelfBooking}
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                                    isSelfBooking 
                                        ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" 
                                        : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                }`}
                                placeholder="VD: 0912345678"
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                            Email nhận vé <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                disabled={isSelfBooking}
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                                    isSelfBooking 
                                        ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" 
                                        : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                }`}
                                placeholder="VD: email@example.com"
                            />
                        </div>
                        {isSelfBooking && (
                            <p className="text-xs text-blue-600 mt-1.5 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Thông tin được lấy tự động từ hồ sơ của bạn.
                            </p>
                        )}
                    </div>

                    {/* GHI CHÚ */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                            Yêu cầu đặc biệt
                        </label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 text-slate-400" size={18} />
                            <textarea
                                name="specialRequest"
                                rows="3"
                                value={formData.specialRequest}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                                placeholder="VD: Nhận phòng sớm, phòng không hút thuốc..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Cảnh báo */}
            <MissingProfileModal 
                isOpen={showMissingModal} 
                onClose={() => setShowMissingModal(false)} 
                missingFields={missingFields} 
            />
        </div>
    );
};

export default ContactInfoForm;