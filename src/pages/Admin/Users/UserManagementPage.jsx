import React, { useState, useEffect, useCallback } from "react";
// ✅ SỬA: Dùng react-hot-toast thay vì react-toastify
import toast from "react-hot-toast";
import UserStats from "./components/UserStats";
import UserFilterBar from "./components/UserFilterBar";
import UserTable from "./components/UserTable";
import adminService from "@/services/admin.service";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import Pagination from "@/pages/Owner/Bookings/components/common/Pagination";

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Filter & Pagination States
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Stats State
    const [stats, setStats] = useState({ total: 0, active: 0, banned: 0 });

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getAllUsers(
                currentPage - 1,
                pageSize,
                searchTerm,
                roleFilter
            );

            // Xử lý dữ liệu trả về từ API
            const data = response.data || response;

            if(data) {
                setUsers(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);

                setStats({
                    total: data.totalElements || 0,
                    active: data.content?.filter(u => u.status === 'ACTIVE').length || 0,
                    banned: data.content?.filter(u => u.status === 'BANNED').length || 0
                });
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, searchTerm, roleFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleRoleChange = (role) => {
        setRoleFilter(role);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStatusChange = async (userId, currentStatus) => {
        const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
        const actionName = newStatus === 'ACTIVE' ? 'mở khóa' : 'khóa';

        if(!window.confirm(`Bạn có chắc muốn ${actionName} tài khoản này?`)) return;

        try {
            await adminService.updateUserStatus(userId, newStatus);
            toast.success(`Đã ${actionName} tài khoản thành công`);
            fetchUsers();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Lỗi cập nhật trạng thái");
        }
    };

    const handleDeleteUser = async (userId) => {
        if(!window.confirm("Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa user này?")) return;
        try {
            await adminService.deleteUser(userId);
            toast.success("Đã xóa người dùng");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Không thể xóa người dùng này");
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50/50 space-y-6 relative">
            {isLoading && <LoadingOverlay />}

            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
                <p className="text-sm text-gray-500">
                    Tổng số: <span className="font-semibold text-blue-600">{totalElements}</span> người dùng
                </p>
            </div>

            <UserStats stats={stats} />

            <UserFilterBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                roleFilter={roleFilter}
                onRoleFilterChange={handleRoleChange}
                onAddUser={() => toast("Tính năng đang phát triển", { icon: 'ℹ️' })}
            />

            <UserTable
                users={users}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteUser}
            />

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