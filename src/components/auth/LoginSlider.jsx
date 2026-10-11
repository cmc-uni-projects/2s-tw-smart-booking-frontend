import React, { useState, useEffect } from "react";
import { MapPin, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2668&auto=format&fit=crop",
    location: "Vịnh Hạ Long, Quảng Ninh", // i18n-ignore (place name)
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop",
    location: "Thành phố Hồ Chí Minh", // i18n-ignore (place name)
    color: "from-orange-500 to-red-400"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2070&auto=format&fit=crop",
    location: "Đà Nẵng", // i18n-ignore (place name)
    color: "from-yellow-400 to-amber-500"
  }
];

const LoginSlider = () => {
  const { t } = useTranslation("auth");
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000); // Chuyển ảnh mỗi 5s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900 hidden lg:block">
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Image with Ken Burns Effect */}
          <img
            src={slide.image}
            alt={slide.location}
            className={`w-full h-full object-cover ${
              index === current ? "animate-ken-burns-slow" : ""
            }`}
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-12 z-20 text-white">
        <div className="flex items-center gap-2 mb-4 animate-fade-in-up">
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
            </div>
            <span className="text-sm font-medium opacity-90">TravelMate's Choice 2024</span>
        </div>

        <h2 className="text-4xl font-black leading-tight mb-4 drop-shadow-xl animate-fade-in-up" key={`title-${current}`}>
            {t(`slider.${SLIDES[current].id}`)}
        </h2>

        <div className="flex items-center gap-2 text-sm font-medium opacity-80 animate-fade-in-up delay-100" key={`loc-${current}`}>
            <MapPin size={18} className={`text-transparent bg-clip-text bg-gradient-to-r ${SLIDES[current].color}`} /> 
            {SLIDES[current].location}
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mt-8">
            {SLIDES.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`h-1 rounded-full transition-all duration-500 ${idx === current ? "w-8 bg-white" : "w-2 bg-white/30"}`}
                />
            ))}
        </div>
      </div>
      
      {/* Branding Logo Top Left */}
      <div className="absolute top-8 left-8 z-20">
         <img src="/assets/logo/logo_travelmate_xoafont.png" alt="TravelMate" className="h-12 w-auto object-contain brightness-0 invert drop-shadow-lg" />
      </div>
    </div>
  );
};

export default LoginSlider;