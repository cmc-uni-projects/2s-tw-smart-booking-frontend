// src/pages/Admin/AuditLogs/AuditLogsPage.jsx

import React, { useEffect, useState } from "react";
import AuditTable from "./AuditTable";
import AuditDetailModal from "./AuditDetailModal";
import Pagination from "@/components/common/Table/Pagination";
import systemLogService from "@/services/systemLog.service";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [selectedLogId, setSelectedLogId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // state cho pagination UI
    const [jumpPage, setJumpPage] = useState("");

    // =========================
    // FETCH LOGS
    // =========================
    const fetchLogs = async (pageIndex = 0) => {
        try {
            const res = await systemLogService.getLogs(pageIndex);
            setLogs(res.content || []);
            setTotalPages(res.totalPages || 0);
            setTotalElements(res.totalElements || 0);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        }
    };

    useEffect(() => {
        fetchLogs(page);
    }, [page]);

    // =========================
    // PAGINATION GROUP (y nguyên logic cũ)
    // =========================
    const getPaginationGroup = () => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= page + 1 - delta && i <= page + 1 + delta)
            ) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) rangeWithDots.push(l + 1);
                else if (i - l !== 1) rangeWithDots.push("...");
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    // =========================
    // HANDLERS
    // =========================
    const handleViewDetail = (logId) => {
        setSelectedLogId(logId);
        setIsDetailOpen(true);
    };

    const handleJumpPage = (e) => {
        if (e.key === "Enter") {
            const p = parseInt(jumpPage);
            if (!isNaN(p) && p >= 1 && p <= totalPages) {
                setPage(p - 1);
                setJumpPage("");
            }
        }
    };

    // =========================
    // RENDER
    // =========================
    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Audit Logs
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Lịch sử hoạt động hệ thống (tạo / sửa / xóa)
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col relative">
                <AuditTable logs={logs} onViewDetail={handleViewDetail} />

                <Pagination
                    currentPage={page + 1}
                    totalPages={totalPages}
                    paginatedCount={logs.length}
                    totalCount={totalElements}
                    onPageChange={(p) => setPage(p - 1)}
                    paginationGroup={getPaginationGroup()}
                    jumpPage={jumpPage}
                    setJumpPage={setJumpPage}
                    onJumpPage={handleJumpPage}
                />
            </div>

            <AuditDetailModal
                open={isDetailOpen}
                logId={selectedLogId}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedLogId(null);
                }}
            />
        </div>
    );
}
