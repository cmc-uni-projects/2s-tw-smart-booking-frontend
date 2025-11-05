import React from "react";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";

// Sections
import HeroSection from "./HeroSection";
import FeaturedHotels from "./FeaturedHotels";
import HotDestinations from "./HotDestinations";
import PromotionBanner from "./PromotionBanner";
import AIRecommendations from "./AIRecommendations";
import TestimonialSection from "./TestimonialSection";

const HomePage = () => {
  return (
    <CustomerLayout>
      <main className="flex flex-col gap-16">
        <HeroSection />
        <FeaturedHotels />
        <HotDestinations />
        <PromotionBanner />
        <AIRecommendations />
        <TestimonialSection />
      </main>
    </CustomerLayout>
  );
};

export default HomePage;
