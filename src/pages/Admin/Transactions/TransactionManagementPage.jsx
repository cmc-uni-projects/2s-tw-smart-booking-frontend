import React, { useEffect, useState, useMemo } from 'react';
import { RefreshCw, Search, CreditCard, Loader2, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";

// Components
import Card from '@/components/common/Card/Card';
import CardHeader from "@/components/common/Card/CardHeader";
import Button from '@/components/common/Button/Button';
import Toast from '@/components/common/Notification/Toast';
import EmptyState from "@/components/common/EmptyState/EmptyState";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

// Component con & Modals
import TransactionRow from './components/TransactionRow';
import AdminTransactionDetailModal from './components/AdminTransactionDetailModal';
import AdminRefundModal from './components/AdminRefundModal';

// Service
import adminService from '@/services/admin.service';

export default function TransactionManagementPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    
    // Filter & Pagination State
    const [filterStatus, setFilterStatus] = useState('ALL'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    // Modal States
    const [detailTransaction, setDetailTransaction] = useState(null);
    const [refundTransaction, setRefundTransaction] = useState(null);

    // --- 1. FETCH DATA ---
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllTransactions();
            // Kiểm tra an toàn dữ liệu trả về
            const dataArray = Array.isArray(data) ? data : (data?.data || []);
            
            // Sắp xếp: REFUND_REQUESTED lên đầu -> Mới nhất
            const sorted = [...dataArray].sort((a, b) => {
                if (a.paymentStatus === 'REFUND_REQUESTED' && b.paymentStatus !== 'REFUND_REQUESTED') return -1;
                if (a.paymentStatus !== 'REFUND_REQUESTED' && b.paymentStatus === 'REFUND_REQUESTED') return 1;
                return new Date(b.paymentDate || 0) - new Date(a.paymentDate || 0);
            });
            setTransactions(sorted);
            setCurrentPage(1); // Reset về trang 1 khi reload
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setToast({ show: true, message: 'Lỗi tải dữ liệu giao dịch', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // --- 2. HANDLERS ---
    
    // Mở Modal Chi tiết
    const handleViewDetail = (trx) => {
        setDetailTransaction(trx);
    };

    // Chuyển từ Modal Chi tiết -> Modal Hoàn tiền
    const handleOpenRefund = (trx) => {
        setDetailTransaction(null); // Đóng modal chi tiết
        setTimeout(() => setRefundTransaction(trx), 200); // Mở modal hoàn tiền
    };

    // Xác nhận Hoàn tiền (Gọi API)
    const handleConfirmRefund = async (bookingId) => {
        setIsActionLoading(true);
        try {
            await adminService.approveRefund(bookingId);
            setToast({ show: true, message: 'Đã hoàn tiền thành công!', type: 'success' });
            await fetchTransactions(); // Reload list để cập nhật trạng thái
        } catch (error) {
            setToast({ show: true, message: error.message || 'Lỗi hoàn tiền', type: 'error' });
        } finally {
            setIsActionLoading(false);
            setRefundTransaction(null);
        }
    };

    // --- 3. FILTER & PAGINATION LOGIC ---
    const filteredList = useMemo(() => {
        let result = transactions;

        // Lọc theo Status Tab
        if (filterStatus !== 'ALL') {
            result = result.filter(t => t.paymentStatus === filterStatus);
        }

        // Lọc theo Search Keyword
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            result = result.filter(t => 
                (t.userName && t.userName.toLowerCase().includes(q)) ||
                (t.bookingId && String(t.bookingId).includes(q)) || 
                (t.paymentId && String(t.paymentId).includes(q)) ||
                (t.propertyName && t.propertyName.toLowerCase().includes(q))
            );
        }
        return result;
    }, [transactions, filterStatus, searchTerm]);

    // Tính toán Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- RENDER ---
    return (
        <>
            {toast.show && (
                <div className="fixed bottom-5 right-5 z-50">
                    <Toast message={toast.message} type={toast.type} />
                </div>
            )}
            {isActionLoading && <LoadingOverlay message="Đang xử lý hoàn tiền..." />}

            <Card className="overflow-hidden min-h-screen bg-gray-50/50 border-none shadow-none p-0">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-1">
                    <CardHeader 
                        title="Quản lý Giao dịch" 
                        subtitle="Theo dõi dòng tiền và xử lý các yêu cầu hoàn tiền" 
                        icon={<CreditCard className="text-blue-600" />} 
                        className="p-0" 
                    />
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchTransactions} 
                        leftIcon={<RefreshCw size={16} className={loading ? "animate-spin" : ""} />}
                        className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                        Làm mới
                    </Button>
                </div>

                {/* FILTER BAR */}
                <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6">
                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {[
                            { key: 'ALL', label: 'Tất cả' },
                            { key: 'REFUND_REQUESTED', label: 'Yêu cầu hoàn tiền', alert: true },
                            { key: 'APPROVED', label: 'Thành công' },
                            { key: 'REFUNDED', label: 'Đã hoàn tiền' },
                            { key: 'FAILED', label: 'Thất bại' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => { setFilterStatus(tab.key); setCurrentPage(1); }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                                    filterStatus === tab.key
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'text-gray-600 hover:bg-gray-100 bg-gray-50 border border-gray-100'
                                }`}
                            >
                                {tab.alert && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="h-px bg-gray-100 w-full"></div>

                    {/* Search */}
                    <div className="w-full md:w-1/2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Tìm kiếm theo Mã GD, Booking ID, Tên khách, Khách sạn..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>

                {/* LIST TRANSACTIONS */}
                <div className="mt-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                            <Loader2 className="animate-spin text-blue-500 mb-3" size={42} />
                            <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <AnimatePresence mode="popLayout">
                                {currentItems.length > 0 ? (
                                    currentItems.map((trx) => (
                                        <motion.div 
                                            key={trx.paymentId} 
                                            layout 
                                            initial={{ opacity: 0, y: 10 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <TransactionRow 
                                                transaction={trx} 
                                                onViewDetail={handleViewDetail}
                                            />
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-white rounded-2xl p-10 border border-gray-200 shadow-sm text-center">
                                        <EmptyState 
                                            title="Không tìm thấy giao dịch" 
                                            description="Không có dữ liệu nào khớp với bộ lọc hiện tại." 
                                            icon={<Inbox className="text-gray-300 w-16 h-16 mb-4"/>}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {!loading && filteredList.length > 0 && (
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4">
                            <div className="text-sm text-gray-500">
                                Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span> - <span className="font-medium">{Math.min(indexOfLastItem, filteredList.length)}</span> trong <span className="font-medium">{filteredList.length}</span> giao dịch
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="!px-3"
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                                
                                <span className="text-sm font-medium text-gray-700 px-3">
                                    Trang {currentPage} / {totalPages}
                                </span>

                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="!px-3"
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* --- MODALS --- */}
            
            <AdminTransactionDetailModal
                isOpen={!!detailTransaction}
                onClose={() => setDetailTransaction(null)}
                transaction={detailTransaction}
                onOpenRefund={handleOpenRefund} 
            />

            <AdminRefundModal
                isOpen={!!refundTransaction}
                onClose={() => setRefundTransaction(null)}
                transaction={refundTransaction}
                onConfirm={handleConfirmRefund}
            />
        </>
    );
}