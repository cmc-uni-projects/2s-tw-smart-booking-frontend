import React from "react";

const partners = [
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Airbnb_Logo.png",
  "https://upload.wikimedia.org/wikipedia/commons/3/3b/Booking.com_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/7/75/Agoda_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/4/44/Expedia_Logo.svg",
];

const PartnerSection = () => (
  <section className="max-w-5xl mx-auto px-6 mt-10">
    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
      🤝 Đối tác của chúng tôi
    </h2>
    <div className="flex justify-center flex-wrap gap-8">
      {partners.map((p, i) => (
        <img key={i} src={p} alt="partner" className="h-10 opacity-80 hover:opacity-100 transition-opacity" />
      ))}
    </div>
  </section>
);

export default PartnerSection;
