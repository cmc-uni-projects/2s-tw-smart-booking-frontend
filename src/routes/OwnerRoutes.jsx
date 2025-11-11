import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import OwnerLayout from "../layouts/OwnerLayout/OwnerLayout";
import OwnerDashboard from "../pages/Owner/Dashboard/OwnerDashboard";

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
                <Route path="*" element={<Navigate to="/owner" replace />} />
            </Routes>
        </OwnerLayout>
    );
};

export default OwnerRoutes;