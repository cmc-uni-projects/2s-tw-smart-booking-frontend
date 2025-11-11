import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import OwnerLayout from "../layouts/OwnerLayout/OwnerLayout";
import OwnerDashboard from "../pages/Owner/Dashboard/OwnerDashboard";

import PropertyListPage from "@/pages/Owner/Properties/PropertyListPage";
import AddPropertyPage from "@/pages/Owner/Properties/AddPropertyPage";

// ✅ 1. Sửa tên import cho rõ ràng
import RoomManagementPage from "@/pages/Owner/Rooms/RoomManagementPage";
// ✅ 2. Import trang danh sách phòng MỚI
import RoomListPage from "@/pages/Owner/Rooms/RoomListPage";


const OwnerRoutes = () => {
    return (
        <OwnerLayout>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />
                
                {/* --- Quản lý Cơ sở --- */}
                <Route
                    path="/properties"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <PropertyListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/properties/new"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <AddPropertyPage />
                        </ProtectedRoute>
                    }
                />
                
                {/* ✅ 3. SỬA LẠI ROUTE QUẢN LÝ PHÒNG */}
                
                {/* Trang chọn khách sạn (index của /rooms) */}
                <Route
                    path="/rooms"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <RoomManagementPage />
                        </ProtectedRoute>
                    }
                />
                
                {/* Trang hiển thị danh sách phòng của 1 khách sạn */}
                <Route
                    path="/rooms/:propertyId"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <RoomListPage />
                        </ProtectedRoute>
                    }
                />

                {/* (Các route khác của owner... /bookings...) */}

                <Route path="*" element={<Navigate to="/owner" replace />} />
            </Routes>
        </OwnerLayout>
    );
};

export default OwnerRoutes;