import React from "react";
import OwnerSidebar from "./OwnerSidebar";
import OwnerHeader from "./OwnerHeader";

const OwnerLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar cố định */}
            <OwnerSidebar />

            {/* Vùng nội dung cuộn đượcc */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header cố định */}
                <OwnerHeader />

                {/* Nội dung chính (cuộn được) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;
