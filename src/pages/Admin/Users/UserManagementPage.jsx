import React, { useState, useEffect, useCallback, useRef } from "react";
// ✅ Import các component Common
import ConfirmModal from "@/components/common/Modal/ConfirmModal";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import Pagination from "@/pages/Owner/Bookings/components/common/Pagination"; // Kiểm tra lại đường dẫn này trong dự án của bạn

// ✅ Import các component con của trang
import UserStats from "./components/UserStats";
import UserFilterBar from "./components/UserFilterBar";
import UserTable from "./components/UserTable";
import LockReasonModal from "./components/LockReasonModal";

// ✅ Import Service
import adminService from "@/services/admin.service";

export default function UserManagementPage() {
    // Ref cho thông báo
    const toastRef = useRef();

    // State dữ liệu
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // State bộ lọc & phân trang
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [rankFilter, setRankFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // State thống kê (Tạm tính trên Frontend hoặc lấy từ API nếu có)
    const [stats, setStats] = useState({ total: 0, active: 0, banned: 0 });

    // State cho Modal Khóa (Nhập lý do)
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [selectedUserForLock, setSelectedUserForLock] = useState(null);

    // State cho Modal Xác nhận (Mở khóa)
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        title: "",
        message: "",
        type: "info",
        confirmText: "Xác nhận",
        onConfirm: null,
    });

    // Helper hiển thị thông báo
    const addToast = (message, mode = "info") => {
        if (toastRef.current) {
            toastRef.current.addMessage({ mode, message });
        }
    };

    // Hàm gọi API lấy danh sách user
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getAllUsers(
                currentPage - 1,
                pageSize,
                searchTerm,
                roleFilter,
                "ALL", // Status filter (đang để ALL)
                rankFilter
            );

            const data = response.data || response;
            if(data) {
                setUsers(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);

                // Cập nhật thống kê (Lưu ý: Logic này đang đếm trên trang hiện tại, lý tưởng nhất là Backend trả về stats)
                setStats({
                    total: data.totalElements || 0,
                    active: data.content?.filter(u => u.status === 'ACTIVE').length || 0,
                    banned: data.content?.filter(u => u.status === 'BANNED').length || 0
                });
            }
        } catch (error) {
            console.error("Failed:", error);
            addToast("Không thể tải danh sách người dùng", "error");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, searchTerm, roleFilter, rankFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // --- HANDLERS ---
    const handleSearchChange = (value) => { setSearchTerm(value); setCurrentPage(1); };
    const handleRoleChange = (role) => { setRoleFilter(role); setCurrentPage(1); };
    const handleRankChange = (rank) => { setRankFilter(rank); setCurrentPage(1); };
    const handlePageChange = (page) => setCurrentPage(page);

    // Xử lý khi nhấn nút hành động trên bảng
    const handleStatusClick = (userId, currentStatus) => {
        const user = users.find(u => u.userId === userId);

        if (currentStatus === "ACTIVE") {
            // Nếu đang Active -> Mở modal Khóa (để nhập lý do)
            setSelectedUserForLock(user);
            setIsLockModalOpen(true);
        } else {
            // Nếu đang Banned -> Mở modal Xác nhận (để mở khóa)
            setConfirmModal({
                open: true,
                title: "Mở khóa tài khoản",
                message: `Bạn có chắc chắn muốn mở khóa cho tài khoản ${user?.fullName}?`,
                type: "success",
                confirmText: "Mở khóa",
                onConfirm: () => executeStatusChange(userId, "ACTIVE", "")
            });
        }
    };

    // Hàm thực thi gọi API cập nhật trạng thái
    const executeStatusChange = async (userId, newStatus, reason) => {
        try {
            await adminService.updateUserStatus(userId, newStatus, reason);

            const actionText = newStatus === "BANNED" ? "Đã khóa" : "Đã mở khóa";
            addToast(`${actionText} tài khoản thành công`, "success");

            // Reset các modal
            setIsLockModalOpen(false);
            setSelectedUserForLock(null);

            // Load lại dữ liệu
            fetchUsers();
        } catch (error) {
            console.error(error);
            addToast("Lỗi cập nhật trạng thái", "error");
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50/50 space-y-6 relative">
            {isLoading && <LoadingOverlay />}

            {/* Portal hiển thị thông báo góc trên màn hình */}
            <ToastPortal ref={toastRef} autoClose={true} />

            {/* Modal Khóa Tài Khoản (Nhập lý do) */}
            <LockReasonModal
                isOpen={isLockModalOpen}
                onClose={() => setIsLockModalOpen(false)}
                userName={selectedUserForLock?.fullName}
                onConfirm={(reason) => executeStatusChange(selectedUserForLock?.userId, "BANNED", reason)}
            />

            {/* Modal Xác Nhận (Dùng cho Mở khóa) */}
            <ConfirmModal
                open={confirmModal.open}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText={confirmModal.confirmText}
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
            />

            {/* Tiêu đề trang */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
            </div>

            {/* Thẻ thống kê */}
            <UserStats stats={stats} />

            {/* Thanh bộ lọc */}
            <UserFilterBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                roleFilter={roleFilter}
                onRoleFilterChange={handleRoleChange}
                rankFilter={rankFilter}
                onRankFilterChange={handleRankChange}
            />

            {/* Bảng dữ liệu */}
            <UserTable
                users={users}
                onStatusChange={handleStatusClick}
            />

            {/* Phân trang */}
            {totalPages > 0 && (
                <div className="mt-4 flex justify-end">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}