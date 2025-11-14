import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Component Tabs có thể cuộn ngang (scrollable) với gạch chân (indicator)
 * và nút bấm cuộn, được tùy chỉnh theo màu sắc chủ đề.
 */
export default function TabsComponent({ tabs, activeTab, onTabChange }) {
    const tabsRef = useRef(null);
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(false);

    // --- Logic xử lý Scroll ---

    /**
     * Kiểm tra xem các nút cuộn (trái/phải) có cần hiển thị không
     */
    const checkScrollButtons = () => {
        const el = tabsRef.current;
        if (!el) return;

        const isOverflowing = el.scrollWidth > el.clientWidth;
        const scrollLeft = Math.ceil(el.scrollLeft);
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;

        setShowLeftScroll(isOverflowing && scrollLeft > 0);
        // Kiểm tra với sai số 1px
        setShowRightScroll(isOverflowing && scrollLeft < (scrollWidth - clientWidth - 1));
    };

    /**
     * Tự động cuộn tab active vào giữa
     */
    useLayoutEffect(() => {
        const el = tabsRef.current;
        if (!el) return;
        
        const activeTabNode = el.querySelector(`[data-tab-id="${activeTab}"]`);
        if (activeTabNode) {
            activeTabNode.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
        // Đợi 0.5s cho animation cuộn hoàn tất rồi kiểm tra lại các nút
        setTimeout(checkScrollButtons, 500); 
    }, [activeTab]);

    /**
     * Gắn listener để kiểm tra nút cuộn khi resize hoặc scroll
     */
    useEffect(() => {
        const el = tabsRef.current;
        if (!el) return;
        
        const resizeObserver = new ResizeObserver(checkScrollButtons);
        resizeObserver.observe(el);
        el.addEventListener('scroll', checkScrollButtons);

        checkScrollButtons(); // Kiểm tra lần đầu

        return () => {
            resizeObserver.unobserve(el);
            el.removeEventListener('scroll', checkScrollButtons);
        };
    }, [tabs]); // Chạy lại nếu danh sách tab thay đổi

    /**
     * Xử lý khi bấm nút cuộn trái/phải
     */
    const handleScrollClick = (direction) => {
        const el = tabsRef.current;
        if (!el) return;
        
        const scrollAmount = el.clientWidth * 0.7 * (direction === 'left' ? -1 : 1);
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        
        setTimeout(checkScrollButtons, 400); // Đợi animation
    };

    // --- Render ---
    return (
        <div className="relative w-full group">
            
            {/* Nút cuộn Trái */}
            <ScrollButton 
                direction="left" 
                onClick={handleScrollClick} 
                isVisible={showLeftScroll} 
            />

            {/* Container cuộn chứa các tab */}
            <div
                ref={tabsRef}
                className="w-full overflow-x-auto border-b border-gray-200 
                           scrollbar-width-none -ms-overflow-style-none [&::-webkit-scrollbar]:hidden"
            >
                <nav className="flex -mb-px px-2 relative">
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            tab={tab}
                            isActive={activeTab === tab.id}
                            onClick={onTabChange}
                        />
                    ))}
                </nav>
            </div>

            {/* Nút cuộn Phải */}
            <ScrollButton 
                direction="right" 
                onClick={handleScrollClick} 
                isVisible={showRightScroll} 
            />
        </div>
    );
}

/**
 * Component con cho Nút Tab (để code chính gọn gàng hơn)
 */
const TabButton = ({ tab, isActive, onClick }) => {
    return (
        <div
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onClick(tab.id)}
            className={`
                relative flex-shrink-0 whitespace-nowrap 
                cursor-pointer select-none
                px-4 py-2 text-sm font-medium
                transition-colors duration-200
                ${isActive ? 'text-[rgb(40,169,224)]' : 'text-gray-500'}
            `}
        >
            {/* Tên Tab */}
            <span className="relative z-10">{tab.name}</span>

            {/* Gạch chân (Indicator) */}
            {isActive && (
                <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(40,169,224)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}
        </div>
    );
};

/**
 * Component con cho Nút Cuộn (Trái/Phải)
 */
const ScrollButton = ({ direction, onClick, isVisible }) => {
    const isLeft = direction === 'left';
    return (
        <button
            type="button"
            onClick={() => onClick(direction)}
            className={`
                absolute top-0 bottom-0 z-10 w-12 
                flex items-center justify-center 
                text-gray-500 hover:text-[rgb(40,169,224)]
                transition-all duration-300
                
                /* Hiệu ứng mờ dần (fade) ở 2 cạnh */
                ${isLeft 
                    ? 'left-0 bg-gradient-to-r from-white via-white to-transparent' 
                    : 'right-0 bg-gradient-to-l from-white via-white to-transparent'
                }

                /* Ẩn/hiện dựa trên state */
                ${isVisible 
                    ? 'opacity-100' 
                    : 'opacity-0 pointer-events-none'
                }
                
                /* Luôn hiển thị nút trên mobile nếu cần (allowScrollButtonsMobile) */
                /* Nếu không muốn hiện trên mobile, xóa class 'opacity-100' này */
                ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
        >
            {isLeft ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
    );
};