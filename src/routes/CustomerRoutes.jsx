import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Home from "@/pages/Customer/Home/HomePage";
import About from "@/pages/Customer/About/About";

const CustomerRoutes = () => {
    return (
        <CustomerLayout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </CustomerLayout>
    );
};

export default CustomerRoutes;
