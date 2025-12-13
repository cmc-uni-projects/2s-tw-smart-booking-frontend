import React, { useMemo } from "react";
import Table from "@/components/common/Table/Table";
import UserInfoCell from "./UserInfoCell";
import UserStatusBadge from "./UserStatusBadge"; // ✅ Import default (không có dấu ngoặc {})
import UserRoleBadge from "./UserRoleBadge";
import ActionMenu from "./ActionMenu";

export default function UserTable({ users, onStatusChange, onDelete }) {
    const columns = [
        { key: "userInfo", label: "Người dùng" },
        { key: "roleDisplay", label: "Vai trò" },
        { key: "contactInfo", label: "Liên hệ" },
        { key: "statusDisplay", label: "Trạng thái" },
        { key: "actions", label: "Hành động" },
    ];

    const tableData = useMemo(() => {
        if (!users || !Array.isArray(users)) return [];

        return users.map((user) => {
            // Xử lý Role: Lấy role đầu tiên trong mảng hoặc default
            const primaryRole = (user.roles && user.roles.length > 0) ? user.roles[0] : "CUSTOMER";

            return {
                ...user,
                // 1. User Info (avatarUrl có thể null, UserInfoCell sẽ xử lý)
                userInfo: (
                    <UserInfoCell
                        avatar={user.avatarUrl}
                        fullName={user.fullName}
                        email={user.email}
                    />
                ),
                // 2. Role
                roleDisplay: <UserRoleBadge role={primaryRole} />,
                // 3. Contact
                contactInfo: (
                    <div className="text-sm text-gray-600">
                        <div>{user.phoneNumber || "---"}</div>
                    </div>
                ),
                // 4. Status
                statusDisplay: <UserStatusBadge status={user.status} />,
                // 5. Actions (Dùng userId thay vì id)
                actions: (
                    <ActionMenu
                        onLock={() => onStatusChange(user.userId, user.status)}
                        onDelete={() => onDelete(user.userId)}
                        onEdit={() => console.log("Edit", user.userId)}
                        isLocked={user.status === 'BANNED'}
                    />
                )
            };
        });
    }, [users, onStatusChange, onDelete]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <Table columns={columns} data={tableData} />
        </div>
    );
}