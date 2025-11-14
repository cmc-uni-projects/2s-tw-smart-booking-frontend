import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import OwnerLayout from "../layouts/OwnerLayout/OwnerLayout";
import OwnerDashboard from "../pages/Owner/Dashboard/OwnerDashboard";

import PropertyListPage from "@/pages/Owner/Properties/PropertyListPage";
import AddPropertyPage from "@/pages/Owner/Properties/AddPropertyPage";
import RoomManagementPage from "@/pages/Owner/Rooms/RoomManagementPage";
import RoomListPage from "@/pages/Owner/Rooms/RoomListPage";

// ✅ 1. Import component placeholder
import PlaceholderPage from "@/pages/Owner/PlaceholderPage";

const OwnerRoutes = () => {
    return (
        <OwnerLayout>
            <Routes>
                {/* Trang Dashboard (mặc định) */}
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
                
                {/* --- Quản lý Phòng --- */}
                <Route
                    path="/rooms"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <RoomManagementPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/rooms/:propertyId"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <RoomListPage />
                        </ProtectedRoute>
                    }
                />

                {/* ✅ 2. THÊM CÁC ROUTE CÒN THIẾU TỪ SIDEBAR */}
                <Route
                    path="/bookings"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <PlaceholderPage title="Quản lý Bookings" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <PlaceholderPage title="Quản lý Tác vụ" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reviews"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <PlaceholderPage title="Quản lý Đánh giá" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <PlaceholderPage title="Cài đặt Khách sạn" />
                        </ProtectedRoute>
                    }
                />

                {/* Route cho /owner/profile (từ dropdown) */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute requiredRole="OWNER">
                            <PlaceholderPage title="Hồ sơ Chủ nhà" />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback về dashboard owner */}
                <Route path="*" element={<Navigate to="/owner" replace />} />
            </Routes>
        </OwnerLayout>
    );
};

export default OwnerRoutes;