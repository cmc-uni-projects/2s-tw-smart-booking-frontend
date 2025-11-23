import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import { AlertCircle, CreditCard, Landmark, User } from 'lucide-react';

export default function RequestRefundModal({ isOpen, onClose, onConfirm, booking }) {
    // State cho các trường nhập liệu
    const [formData, setFormData] = useState({
        reason: '',
        bankName: '',
        accountNumber: '',
        accountHolder: ''
    });
    
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Reset form khi mở modal
    useEffect(() => {
        if (isOpen) {
            setFormData({ reason: '', bankName: '', accountNumber: '', accountHolder: '' });
            setError('');
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        const { reason, bankName, accountNumber, accountHolder } = formData;

        // 1. Validate
        if (!reason.trim() || !bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if (reason.trim().length < 5) {
            setError('Lý do hoàn tiền quá ngắn.');
            return;
        }

        setSubmitting(true);

        // 2. Gộp thông tin
        const fullReasonData = `
            [LÝ DO]: ${reason}
            --------------------------------
            [THÔNG TIN NHẬN TIỀN]:
            - Ngân hàng: ${bankName}
            - STK: ${accountNumber}
            - Chủ TK: ${accountHolder.toUpperCase()}
        `.trim();

        // 3. Gọi callback
        await onConfirm(booking, fullReasonData);
        
        setSubmitting(false);
    };

    return (
        <Modal
            open={isOpen} // ✅ SỬA LỖI QUAN TRỌNG TẠI ĐÂY (Sửa isOpen -> open)
            onClose={onClose}
            title="Gửi yêu cầu hoàn tiền"
            maxWidth="max-w-lg"
        >
            <div className="space-y-5">
                {/* Info Box */}
                <div className="bg-orange-50 text-orange-800 p-3 rounded-lg flex gap-3 text-sm border border-orange-100">
                    <AlertCircle className="shrink-0 w-5 h-5" />
                    <div>
                        <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                        <p>
                            Số tiền hoàn lại dự kiến: <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(booking?.refundAmount || 0)}₫</span>.
                        </p>
                        <p className="mt-1">
                            Vui lòng cung cấp chính xác thông tin tài khoản ngân hàng để Admin thực hiện chuyển khoản.
                        </p>
                    </div>
                </div>

                {/* Form Lý do */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lý do hoàn tiền <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="reason"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                        rows={3}
                        placeholder="VD: Tôi bận việc đột xuất, chuyến bay bị hủy..."
                        value={formData.reason}
                        onChange={handleChange}
                    />
                </div>

                {/* Form Thông tin ngân hàng */}
                <div className="space-y-3 pt-2 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <CreditCard size={16} className="text-blue-600"/> Thông tin tài khoản nhận tiền
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Ngân hàng <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Landmark size={14} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="bankName"
                                    className="w-full border border-gray-300 rounded-lg pl-9 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="VD: MBBank"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Số tài khoản <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="accountNumber"
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                placeholder="VD: 0338..."
                                value={formData.accountNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Chủ tài khoản (Không dấu) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User size={14} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                name="accountHolder"
                                className="w-full border border-gray-300 rounded-lg pl-9 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                placeholder="NGUYEN VAN A"
                                value={formData.accountHolder}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-xs text-center font-medium bg-red-50 p-2 rounded">{error}</p>}

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose} disabled={submitting}>
                        Hủy bỏ
                    </Button>
                    <Button 
                        className="bg-orange-600 hover:bg-orange-700 text-white shadow-md"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}