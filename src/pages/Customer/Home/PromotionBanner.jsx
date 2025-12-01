import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import promotionService from "@/services/promotion.service";
import { Clock, ArrowRight, Gift, Zap, ChevronRight } from 'lucide-react';

// --- CONFIGURATION ---
const AUTO_SWITCH_TIME = 6000;
const BE_BASE_URL = "http://localhost:8386";
const UPLOAD_DIR = "/uploads/";

const getFullImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BE_BASE_URL}${UPLOAD_DIR}${cleanPath}`;
};

// ==========================================
// COMPONENT 1: Tag Badge
// ==========================================
const CategoryBadge = ({ text }) => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 mb-4 shadow-sm">
        <Zap size={12} className="fill-blue-600" />
        {text}
    </span>
);

// ==========================================
// COMPONENT 2: Circular Progress Timer
// ==========================================
const CircularCountdown = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const calculateTime = () => {
            const diff = new Date(endDate) - new Date();
            if (diff > 0) {
                return {
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                };
            }
            return null;
        };
        setTimeLeft(calculateTime());
        const timer = setInterval(() => setTimeLeft(calculateTime()), 60000);
        return () => clearInterval(timer);
    }, [endDate]);

    if (!timeLeft) return null;

    const TimeCircle = ({ val, label }) => (
        <div className="flex flex-col items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30 flex items-center justify-center bg-black/20 backdrop-blur-md shadow-inner">
                <span className="text-xs md:text-sm font-bold text-white font-sans">{val}</span>
            </div>
            <span className="text-[10px] text-gray-200 mt-1 uppercase font-bold tracking-wide drop-shadow-md">{label}</span>
        </div>
    );

    return (
        <div className="absolute top-4 right-4 flex gap-3 z-20">
            <TimeCircle val={timeLeft.days} label="Ngày" />
            <TimeCircle val={timeLeft.hours} label="Giờ" />
        </div>
    );
};

// ==========================================
// COMPONENT 3: Sidebar List Item
// ==========================================
const SidebarItem = memo(({ promo, isActive, onClick, progress }) => {
    return (
        <div
            onClick={onClick}
            className={`relative p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-300 border-l-4 group overflow-hidden flex items-center gap-3 md:gap-4
                ${isActive
                ? 'bg-white border-blue-600 shadow-md z-10'
                : 'bg-gray-50 border-transparent hover:bg-gray-100 opacity-80 hover:opacity-100'
            }`}
        >
            {isActive && (
                <div
                    className="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-100 ease-linear z-20"
                    style={{ width: `${progress}%` }}
                />
            )}

            <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                <img src={promo.image} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className={`text-sm font-bold leading-tight mb-1 truncate font-sans ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                    {promo.title}
                </h4>
                <p className="text-xs text-gray-500 font-medium truncate flex items-center gap-1 font-sans">
                    <Gift size={12} />
                    Giảm {promo.discountValue}{promo.discountType === 'PERCENTAGE' ? '%' : 'đ'}
                </p>
            </div>

            <ChevronRight
                size={18}
                className={`transition-all duration-300 ${isActive ? 'text-blue-600 translate-x-0 opacity-100' : 'translate-x-2 opacity-0 w-0'}`}
            />
        </div>
    );
});

// ==========================================
// COMPONENT 4: Main Stage
// ==========================================
const MainStage = ({ promo, onAction }) => {
    if (!promo) return null;

    return (
        <div className="relative h-[380px] md:h-[500px] rounded-3xl overflow-hidden group shadow-xl">
            <img
                src={promo.image}
                alt={promo.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-transparent" />

            <div className="absolute top-6 left-6 z-20">
                <span className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 animate-pulse">
                    <Gift size={14} /> NEW ARRIVAL
                </span>
            </div>

            <CircularCountdown endDate={promo.endDate} />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-20">
                <div className="transform transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <CategoryBadge text="Travel Mate Exclusive" />

                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 md:mb-4 leading-tight line-clamp-2 drop-shadow-lg font-sans tracking-tight">
                        {promo.title}
                    </h2>

                    <p className="text-gray-200 text-sm md:text-lg mb-6 line-clamp-2 max-w-xl font-medium font-sans opacity-90">
                        {promo.description}
                    </p>

                    <button
                        onClick={() => onAction(promo)}
                        className="group/btn inline-flex items-center gap-2 md:gap-3 px-6 py-2.5 md:px-8 md:py-3 bg-white text-blue-900 rounded-full font-bold transition-all hover:bg-blue-600 hover:text-white shadow-lg active:scale-95 font-sans text-sm md:text-base"
                    >
                        Khám phá ngay
                        <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// COMPONENT 5: Header Section
// ==========================================
const PromoSectionHeader = ({ onSeeAll }) => (
    <div className="flex items-end justify-between mb-6 md:mb-8 px-2">
        <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2 font-sans tracking-tight">
                Ưu Đãi <span className="text-blue-600 relative inline-block">
                    Mới Nhất
                    <svg className="absolute w-full h-2 bottom-0 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                </span>
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base font-sans">Cập nhật liên tục các deal hot vừa ra mắt</p>
        </div>
        <button
            onClick={onSeeAll}
            className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-blue-200 font-sans"
        >
            Xem tất cả
            <ArrowRight size={16} />
        </button>
    </div>
);

// ==========================================
// MAIN COMPONENT: PromotionBanner
// ==========================================
const PromotionBanner = () => {
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    // Fetch API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await promotionService.getAllPromotions();
                const rawData = Array.isArray(response) ? response : (response.data || []);
                const now = new Date();

                // 1. Lọc các khuyến mãi đang chạy
                const activePromotions = rawData.filter(p =>
                    p.status === "ACTIVE" &&
                    new Date(p.endDate) > now &&
                    p.bannerUrl
                );

                // 2. [QUAN TRỌNG] Sắp xếp ID giảm dần để MỚI NHẤT lên đầu
                activePromotions.sort((a, b) => b.promotionId - a.promotionId);

                // 3. Map dữ liệu và lấy 4 cái đầu tiên
                const validData = activePromotions.map(p => ({
                    id: p.promotionId,
                    title: p.description,
                    description: p.description,
                    discountValue: p.discountValue,
                    discountType: p.discountType,
                    endDate: p.endDate,
                    image: getFullImageUrl(p.bannerUrl)
                })).slice(0, 4);

                setPromotions(validData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Logic Auto Scroll
    useEffect(() => {
        if (promotions.length <= 1) return;
        setProgress(0);
        const progressInterval = setInterval(() => {
            setProgress(prev => (prev >= 100 ? 0 : prev + (100 / (AUTO_SWITCH_TIME / 100))));
        }, 100);
        const slideInterval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % promotions.length);
        }, AUTO_SWITCH_TIME);
        return () => {
            clearInterval(progressInterval);
            clearInterval(slideInterval);
        };
    }, [activeIndex, promotions.length]);

    const handleSidebarClick = (index) => {
        setActiveIndex(index);
        setProgress(0);
    };

    // Deep Link Logic
    const handleExplore = (promo) => {
        navigate('/promotions', {
            state: { targetPromoId: promo.id }
        });
    };

    if (loading) return <div className="container mx-auto h-[400px] bg-gray-100 animate-pulse rounded-3xl mt-12 mb-12" />;
    if (promotions.length === 0) return null;

    return (
        <section className="container mx-auto px-4 py-8 md:py-12">
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');`}
            </style>

            <div className="font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                <PromoSectionHeader onSeeAll={() => navigate('/promotions')} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">

                    {/* LEFT COLUMN: Main Stage */}
                    <div className="lg:col-span-8 h-full">
                        <MainStage
                            promo={promotions[activeIndex]}
                            onAction={handleExplore}
                        />
                    </div>

                    {/* RIGHT COLUMN: Playlist Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-3 md:gap-4 h-[400px] lg:h-full overflow-y-auto pr-1 custom-scrollbar">
                        {promotions.map((promo, idx) => (
                            <SidebarItem
                                key={promo.id}
                                promo={promo}
                                isActive={idx === activeIndex}
                                onClick={() => handleSidebarClick(idx)}
                                progress={idx === activeIndex ? progress : 0}
                            />
                        ))}

                        <div className="mt-auto p-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl text-white text-center hidden lg:block shadow-lg">
                            <p className="text-sm font-medium mb-3 opacity-90">Bạn muốn xem thêm ưu đãi?</p>
                            <button
                                onClick={() => navigate('/promotions')}
                                className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-bold transition-all border border-white/20"
                            >
                                Khám phá ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
            `}</style>
        </section>
    );
};

export default PromotionBanner;