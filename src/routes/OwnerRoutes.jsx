import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import OwnerLayout from "../layouts/OwnerLayout/OwnerLayout";
import OwnerDashboard from "../pages/Owner/Dashboard/OwnerDashboard";

import PropertyListPage from "@/pages/Owner/Properties/PropertyListPage";
import AddPropertyPage from "@/pages/Owner/Properties/AddPropertyPage";

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
                
                {/* --- THÊM 2 ROUTE MỚI --- */}
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

                {/* (Các route khác của owner... /rooms, /bookings...) */}

                <Route path="*" element={<Navigate to="/owner" replace />} />
            </Routes>
        </OwnerLayout>
    );
};

export default OwnerRoutes;