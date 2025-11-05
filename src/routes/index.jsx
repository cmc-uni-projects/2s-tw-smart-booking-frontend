import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerRoutes from "./CustomerRoutes";
import AdminRoutes from "./AdminRoutes";
import OwnerRoutes from "./OwnerRoutes";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/*" element={<CustomerRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/owner/*" element={<OwnerRoutes />} />
        </Routes>
    );
};

export default AppRoutes;