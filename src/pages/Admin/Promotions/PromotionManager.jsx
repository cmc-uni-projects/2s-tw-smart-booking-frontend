import React, { useState } from "react";
import Table from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import PromotionFormModal from "./components/PromotionFormModal";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

const PromotionManager = () => {
    // 1. Mock Data
    const [promotions, setPromotions] = useState([
        {
            id: 1,
            code: "SUMMER2025",
            name: "Hè rực rỡ - Giảm giá cực sâu",
            type: "PERCENT",
            value: 20,
            quantity: 100,
            minOrder: 500000,
            maxDiscount: 200000,
            startDate: "2025-06-01",
            endDate: "2025-08-31",
            status: "Active",
        },
        {
            id: 2,
            code: "WELCOME",
            name: "Chào bạn mới",
            type: "FIXED",
            value: 100000,
            quantity: 50,
            minOrder: 0,
            maxDiscount: 100000,
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            status: "Active",
        },
        {
            id: 3,
            code: "VIP_ONLY",
            name: "Tri ân khách hàng VIP",
            type: "PERCENT",
            value: 15,
            quantity: 20,
            minOrder: 1000000,
            maxDiscount: 500000,
            startDate: "2025-11-10",
            endDate: "2025-11-20",
            status: "Inactive",
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);

    // 2. Cấu hình Cột
    const columns = [
        { key: "code", label: "Mã Code" },
        { key: "name", label: "Tên chương trình" },
        { key: "details", label: "Chi tiết giảm" },
        { key: "quantity", label: "SL" },
        { key: "endDate", label: "Hết hạn" },
        { key: "status", label: "Trạng thái" },
    ];

    const getDisplayData = (data) => {
        return data.map(item => ({
            ...item,
            details: item.type === 'PERCENT'
                ? `${item.value}% (Tối đa ${Number(item.maxDiscount).toLocaleString()}đ)`
                : `${Number(item.value).toLocaleString()}đ`,
        }));
    };

    const handleSave = (data) => {
        if (editingPromo) {
            setPromotions((prev) =>
                prev.map((item) =>
                    item.id === editingPromo.id ? { ...data, id: item.id, status: item.status } : item
                )
            );
        } else {
            const newId = promotions.length + 1;
            setPromotions((prev) => [
                ...prev,
                { ...data, id: newId, status: "Active" },
            ]);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa mã này không?")) {
            setPromotions((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const openEditModal = (promo) => {
        setEditingPromo(promo);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingPromo(null);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Tag className="text-[rgb(40,169,224)]" /> Quản lý Khuyến mãi
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tạo và quản lý các mã giảm giá, voucher cho hệ thống.
                    </p>
                </div>
                <Button onClick={openAddModal} leftIcon={<Plus size={18} />}>
                    Thêm mã mới
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <Table columns={columns} data={getDisplayData(promotions)} />

                <div className="p-4 border-t bg-gray-50 text-sm text-gray-500">
                    <div className="flex items-center gap-2 mb-2">
                        <Edit className="w-4 h-4"/> <span>Thao tác nhanh (Debug Mode):</span>
                    </div>
                    <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {promotions.map(p => (
                            <div key={p.id} className="flex justify-between items-center bg-white p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <div className="font-bold text-gray-800">{p.code}</div>
                                    <div className="text-xs text-gray-500">{p.name}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Sửa">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Xóa">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <PromotionFormModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSave}
                initialData={editingPromo}
            />
        </div>
    );
};

export default PromotionManager;