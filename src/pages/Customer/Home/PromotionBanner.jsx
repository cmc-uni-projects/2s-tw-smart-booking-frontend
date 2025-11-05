import React from "react";
import Button from "@/components/common/Button/Button";

const PromotionBanner = () => {
  return (
    <section className="relative max-w-6xl mx-auto mt-10">
      <div className="bg-gradient-to-r from-[rgb(40,169,224)] to-[#006494] text-white rounded-2xl p-10 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">🎁 Ưu đãi đặc biệt!</h2>
          <p>Giảm ngay 20% cho đơn đặt đầu tiên trong tháng này.</p>
        </div>
        <Button size="lg" variant="light" className="mt-4 md:mt-0 bg-white text-[rgb(40,169,224)]">
          Nhận ưu đãi
        </Button>
      </div>
    </section>
  );
};

export default PromotionBanner;
