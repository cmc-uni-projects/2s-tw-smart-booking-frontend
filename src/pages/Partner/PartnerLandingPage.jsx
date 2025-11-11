import React from "react";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";

// 1. Import các component con mới
import PartnerHeroSection from "./components/PartnerHeroSection";
import PartnerCTASection from "./components/PartnerCTASection";

// 2. Import component tái sử dụng
import Partners from "@/pages/Customer/About/Partners"; 

const PartnerLandingPage = () => {
  return (
    <CustomerLayout>
      <main className="flex flex-col">
        
        {/* 3. Thứ tự mới theo yêu cầu */}
        
        {/* Section 1: Hero */}
        <PartnerHeroSection />

        {/* Section 2: CTA Nổi bật */}
        <PartnerCTASection />

        {/* Section 3: Đối tác */}
        <Partners />

      </main>
    </CustomerLayout>
  );
};

export default PartnerLandingPage;