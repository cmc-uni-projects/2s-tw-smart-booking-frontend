import React, { useMemo } from "react";
import Table from "@/components/common/Table/Table";
import UserInfoCell from "./UserInfoCell";
import UserStatusBadge from "./UserStatusBadge";
import UserRoleBadge from "./UserRoleBadge";
import UserRankBadge from "./UserRankBadge"; // ✅ Import component mới
import ActionMenu from "./ActionMenu";

export default function UserTable({ users, onStatusChange }) {
    const columns = [
        { key: "userInfo", label: "Người dùng" },
        { key: "roleDisplay", label: "Vai trò" },
        { key: "rankDisplay", label: "Hạng TV" }, // ✅ Thêm cột Hạng Thành Viên
        { key: "contactInfo", label: "Liên hệ" },
        { key: "statusDisplay", label: "Trạng thái" },
        {
            key: "actions",
            label: <div className="text-center w-full">Hành động</div>
        },
    ];

    const tableData = useMemo(() => {
        if (!users || !Array.isArray(users)) return [];

        return users.map((user) => {
            const primaryRole = (user.roles && user.roles.length > 0) ? user.roles[0] : "CUSTOMER";

            return {
                ...user,
                userInfo: (
                    <UserInfoCell
                        avatar={user.avatarUrl}
                        fullName={user.fullName}
                        email={user.email}
                    />
                ),
                roleDisplay: <UserRoleBadge role={primaryRole} />,

                // ✅ Map dữ liệu Rank (Giả sử field từ API là 'rank')
                rankDisplay: <UserRankBadge rank={user.rank} />,

                contactInfo: (
                    <div className="text-sm text-gray-600">
                        <div>{user.phoneNumber ? user.phoneNumber : ""}</div>
                    </div>
                ),
                statusDisplay: <UserStatusBadge status={user.status} />,
                actions: (
                    <ActionMenu
                        onLock={() => onStatusChange(user.userId, user.status)}
                        isLocked={user.status === 'BANNED'}
                    />
                )
            };
        });
    }, [users, onStatusChange]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <Table columns={columns} data={tableData} />
        </div>
    );
}