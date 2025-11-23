import React, { useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import { AlertCircle } from 'lucide-react';

export default function RequestRefundModal({ isOpen, onClose, onConfirm, booking }) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim()) {
            setError('Vui lòng nhập lý do hoàn tiền.');
            return;
        }
        if (reason.trim().length < 10) {
            setError('Lý do phải dài ít nhất 10 ký tự.');
            return;
        }

        setSubmitting(true);
        await onConfirm(booking, reason);
        setSubmitting(false);
        setReason('');
        setError('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Yêu cầu hoàn tiền"
            size="md"
        >
            <div className="space-y-4">
                <div className="bg-blue-50 text-blue-800 p-3 rounded-lg flex gap-3 text-sm">
                    <AlertCircle className="shrink-0 w-5 h-5" />
                    <p>
                        Yêu cầu của bạn sẽ được gửi tới Admin/Chủ khách sạn để xem xét. 
                        Tiền sẽ được hoàn về phương thức thanh toán ban đầu nếu được duyệt.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lý do hoàn tiền <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        rows={4}
                        placeholder="VD: Tôi có việc bận đột xuất, chuyến bay bị hủy..."
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            if (error) setError('');
                        }}
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onClose} disabled={submitting}>
                        Đóng
                    </Button>
                    <Button 
                        className="bg-orange-600 hover:bg-orange-700 text-white"
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