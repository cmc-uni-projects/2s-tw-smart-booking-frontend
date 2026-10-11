import React from "react";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import { useTranslation } from "react-i18next";

// Định nghĩa danh sách các Tab theo trạng thái
const TABS = [
    { id: "ALL" },
    { id: "SUCCESS" },
    { id: "PENDING" },
    { id: "REFUNDED" },
    { id: "FAILED" },
];

export default function TransactionTabs({ activeTab, onTabChange }) {
    const { t } = useTranslation("profile");
    return (
        <div className="border-b border-gray-200 mb-4">
            <TabsComponent
                tabs={TABS.map((tab) => ({ ...tab, name: t(tab.id === "ALL" ? "tx.tabs.ALL" : `tx.status.${tab.id}`) }))}
                activeTab={activeTab}
                onTabChange={onTabChange}
            />
        </div>
    );
}