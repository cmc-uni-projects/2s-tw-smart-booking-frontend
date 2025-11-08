import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import OwnerLayout from "../layouts/OwnerLayout/OwnerLayout";
import OwnerDashboard from "../pages/Owner/Dashboard/OwnerDashboard";

const OwnerRoutes = () => {
    return (
        <OwnerLayout> {/* ✅ Đổi layoutt */}
            <Routes>
                {/* Tất cả routes bên trong đều yêu cầu role "OWNER" */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute requiredRole="OWNER"> {/* ✅ Đổi role */}
                            <OwnerDashboard /> {/* ✅ Đổi trang dashboard */}
                        </ProtectedRoute>
                    }
                />
                {/* <Route
          path="/rooms"
          element={
            <ProtectedRoute requiredRole="OWNER">
              <RoomListPage />
            </ProtectedRoute>
          }
        /> 
        <Route
          path="/bookings"
          element={
            <ProtectedRoute requiredRole="OWNER">
              <OwnerBookingList />
            </ProtectedRoute>
          }
        />
        */}

                {/* Fallback về dashboard owner nếu gõ sai URL */}
                <Route path="*" element={<Navigate to="/owner" replace />} /> {/* ✅ Đổi fallback */}
            </Routes>
        </OwnerLayout>
    );
};

export default OwnerRoutes; 
