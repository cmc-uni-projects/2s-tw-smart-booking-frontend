// src/pages/Customer/Promotion/components/AutoScrollBanner.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const AutoScrollBanner = ({ promotions }) => {
    const navigate = useNavigate();

    // 1. Lọc khuyến mãi có ảnh
    const bannerPromotions = promotions?.filter(p => p.image) || [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Cấu hình thời gian
    const AUTO_PLAY_TIME = 4000;
    const TRANSITION_DURATION = 1500;

    // --- HÀM XỬ LÝ CLICK ---
    const handleBannerClick = useCallback(() => {
        // Thay đổi đường dẫn này thành route thực tế của trang "Voucher của tôi" trong dự án của bạn
        // Ví dụ: '/profile', '/my-vouchers', hoặc '/account/vouchers'
        // Dựa trên cấu trúc file, thường sẽ là '/profile'
        navigate('/profile');
    }, [navigate]);

    // 2. Chuyển slide tiếp theo
    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % bannerPromotions.length);
        setTimeout(() => setIsAnimating(false), TRANSITION_DURATION);
    }, [bannerPromotions.length, isAnimating]);

    // 3. Quay lại slide trước
    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + bannerPromotions.length) % bannerPromotions.length);
        setTimeout(() => setIsAnimating(false), TRANSITION_DURATION);
    }, [bannerPromotions.length, isAnimating]);

    // 4. Tự động chạy
    useEffect(() => {
        if (bannerPromotions.length <= 1 || isPaused) return;
        const timer = setInterval(() => {
            nextSlide();
        }, AUTO_PLAY_TIME);
        return () => clearInterval(timer);
    }, [nextSlide, isPaused, bannerPromotions.length]);

    if (bannerPromotions.length === 0) return null;

    const currentPromo = bannerPromotions[currentIndex];

    return (
        <div
            className="relative w-full h-[500px] md:h-[600px] lg:h-[750px] overflow-hidden rounded-3xl shadow-2xl group my-8 select-none bg-gray-900 cursor-pointer"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={handleBannerClick} // Click vào banner cũng chuyển trang
        >
            {/* --- LAYER 1: BACKGROUND IMAGES --- */}
            {bannerPromotions.map((promo, index) => {
                const isActive = index === currentIndex;
                return (
                    <div
                        key={`${promo.id}-${index}`}
                        className={`absolute inset-0 w-full h-full transition-opacity ease-in-out
                            ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                        `}
                        style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
                    >
                        <div className={`w-full h-full transform transition-transform duration-[10000ms] ease-linear
                            ${isActive ? 'scale-110' : 'scale-100'}
                        `}>
                            <img
                                src={promo.image}
                                alt={promo.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent opacity-80" />
                    </div>
                );
            })}

            {/* --- LAYER 2: NỘI DUNG CHỮ --- */}
            <div className="absolute inset-0 z-20 flex items-center px-6 md:px-16 container mx-auto">
                <div key={currentIndex} className="max-w-3xl transform pt-10">

                    {/* Title */}
                    <h2 className="animate-fade-in-up [animation-delay:200ms] opacity-0 translate-y-8 fill-mode-forwards text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl line-clamp-2">
                        {currentPromo.title}
                    </h2>

                    {/* Description */}
                    <p className="animate-fade-in-up [animation-delay:400ms] opacity-0 translate-y-8 fill-mode-forwards text-lg md:text-xl lg:text-2xl text-gray-200 mb-10 font-light line-clamp-3 leading-relaxed max-w-2xl text-shadow-sm">
                        {currentPromo.description}
                    </p>

                    {/* Buttons & Discount */}
                    <div className="animate-fade-in-up [animation-delay:600ms] opacity-0 translate-y-8 fill-mode-forwards flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài (dù cả banner đều link 1 nơi nhưng giữ thói quen này tốt hơn)
                                handleBannerClick();
                            }}
                            className="group/btn relative inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-white text-gray-900 rounded-full font-bold text-lg md:text-xl transition-all hover:bg-blue-600 hover:text-white shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] active:scale-95"
                        >
                            Xem chi tiết
                            <ArrowRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-2" />
                        </button>

                        {currentPromo.discountValue > 0 && (
                            <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white cursor-default">
                                <span className="font-bold text-yellow-400 text-2xl">{currentPromo.discountValue}%</span>
                                <span className="text-base text-gray-300 font-medium">GIẢM GIÁ</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- LAYER 3: NÚT ĐIỀU HƯỚNG --- */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100 -translate-x-6 group-hover:translate-x-0 hover:scale-110 z-30"
            >
                <ChevronLeft size={32} />
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100 translate-x-6 group-hover:translate-x-0 hover:scale-110 z-30"
            >
                <ChevronRight size={32} />
            </button>

            {/* --- LAYER 4: DOTS --- */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
                {bannerPromotions.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isAnimating) {
                                setIsAnimating(true);
                                setCurrentIndex(idx);
                                setTimeout(() => setIsAnimating(false), TRANSITION_DURATION);
                            }
                        }}
                        className={`transition-all duration-500 rounded-full h-2 ${
                            idx === currentIndex
                                ? 'w-14 bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)]'
                                : 'w-4 bg-white/40 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* --- CUSTOM ANIMATION --- */}
            <style jsx>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in-up {
                animation-name: fadeInUp;
                animation-duration: 0.8s;
                animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
                animation-fill-mode: forwards;
              }
              .fill-mode-forwards { animation-fill-mode: forwards; }
              .text-shadow-sm { text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
            `}</style>
        </div>
    );
};

export default AutoScrollBanner;