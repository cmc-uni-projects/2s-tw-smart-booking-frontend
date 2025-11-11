// src/layouts/CustomerLayout/CustomerDashboardLayout.jsx (ĐÃ SỬA ĐỂ TRÁNH LỖI XUNG ĐỘT LAYOUT)

import React from "react";
// ❌ KHÔNG IMPORT Sidebar
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const CustomerDashboardLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <Header />

            <div className="flex flex-grow pt-[80px]">
                {/* ❌ ĐÃ XÓA Sidebar Cấp 1 */}

                <main className="flex-1 p-0"> {/* p-0 để ProfilePage tự quản lý padding */}
                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default CustomerDashboardLayout;