import React from "react";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";

const FeaturedHotels = () => {
  const hotels = [
    { id: 1, name: "The Ocean Resort", location: "Đà Nẵng", price: "2.200.000₫/đêm", image: "https://images.unsplash.com/photo-1501117716987-c8e2a0a1f1b2" },
    { id: 2, name: "Mountain Retreat", location: "Sapa", price: "1.700.000₫/đêm", image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a" },
    { id: 3, name: "Urban Stay", location: "Hà Nội", price: "1.500.000₫/đêm", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🏨 Khách sạn nổi bật</h2>
        <Button variant="outline">Xem tất cả</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {hotels.map((h) => (
          <Card key={h.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <img src={h.image} alt={h.name} className="h-56 w-full object-cover group-hover:scale-105 transition-transform" />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{h.name}</h3>
              <p className="text-sm text-gray-500">{h.location}</p>
              <div className="flex justify-between items-center mt-3">
                <Badge>{h.price}</Badge>
                <Button size="sm">Đặt ngay</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedHotels;
