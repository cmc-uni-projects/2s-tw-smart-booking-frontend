import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { format, addDays } from 'date-fns';
import { 
    MapPin, Star, Wifi, Waves, ParkingCircle, Utensils, 
    Droplet, Users, Wind, Check, Coffee, Tv 
} from "lucide-react";

// Components Common
import Spinner from "@/components/common/Loading/Spinner";
import Card from "@/components/common/Card/Card";
import Badge from "@/components/common/Badge/Badge";
import ImageViewerModal from "@/pages/Admin/Hotels/components/ImageViewerModal";
import ModernBreadcrumb from "@/components/common/Breadcrumb/ModernBreadcrumb";

// Sub-components
import HotelHeader from "./components/HotelHeader";
import HotelStickyNav from "./components/HotelStickyNav";
import HotelOverview from "./components/HotelOverview";
import HotelPolicies from "./components/HotelPolicies";
import HotelSidebar from "./components/HotelSidebar";
import RoomListSection from "./components/RoomListSection";
import RoomDetailModal from "./components/RoomDetailModal";
import { ReviewsSection } from "./components/HotelInfoTabs"; // Chỉ giữ lại ReviewsSection

// Service
import propertyService from "@/services/property.service";

// --- HELPERS & CONSTANTS ---
const BASE_URL = "http://localhost:8386"; 

const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x600?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path}`;
};

const getAmenityIcon = (amenityName) => {
    const name = amenityName?.toLowerCase() || "";
    if (name.includes("wifi") || name.includes("internet")) return <Wifi size={18} />;
    if (name.includes("pool") || name.includes("bơi")) return <Waves size={18} />;
    if (name.includes("parking") || name.includes("đỗ xe")) return <ParkingCircle size={18} />;
    if (name.includes("restaurant") || name.includes("nhà hàng") || name.includes("ăn")) return <Utensils size={18} />;
    if (name.includes("spa") || name.includes("massage")) return <Droplet size={18} />;
    if (name.includes("gym") || name.includes("thể thao")) return <Users size={18} />;
    if (name.includes("ac") || name.includes("điều hòa") || name.includes("máy lạnh")) return <Wind size={18} />;
    if (name.includes("tv") || name.includes("truyền hình")) return <Tv size={18} />;
    if (name.includes("bar") || name.includes("cafe")) return <Coffee size={18} />;
    return <Check size={18} />; 
};

export default function HotelDetailPage() {
    const { hotelId } = useParams();
    const [searchParams] = useSearchParams();
    
    const [hotel, setHotel] = useState(null);
    const [policies, setPolicies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [dateRange, setDateRange] = useState({
        startDate: searchParams.get("checkIn") ? new Date(searchParams.get("checkIn")) : new Date(),
        endDate: searchParams.get("checkOut") ? new Date(searchParams.get("checkOut")) : addDays(new Date(), 1)
    });

    const [isViewerOpen, setViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);
    const [activeSection, setActiveSection] = useState("overview");

    // Fetch Data
    useEffect(() => {
        const fetchAllData = async () => {
            if (!hotelId) return;
            setLoading(true);
            try {
                const checkInStr = format(dateRange.startDate, "yyyy-MM-dd");
                const checkOutStr = format(dateRange.endDate, "yyyy-MM-dd");

                const [hotelData, policyData] = await Promise.all([
                    propertyService.getPropertyDetail(hotelId, checkInStr, checkOutStr),
                    propertyService.getPropertyPolicies(hotelId)
                ]);
                
                const mappedHotel = {
                    id: hotelData.propertyId,
                    name: hotelData.propertyName,
                    description: hotelData.description,
                    rating: hotelData.rating,
                    reviewsCount: hotelData.reviewCount,
                    location: `${hotelData.address}, ${hotelData.city}`,
                    latitude: hotelData.latitude,   // Thêm dòng này
                    longitude: hotelData.longitude, // Thêm dòng này
                    images: (hotelData.images && hotelData.images.length > 0) 
                        ? hotelData.images.map(getFullImageUrl)
                        : [getFullImageUrl(hotelData.coverImage)],
                    amenities: hotelData.amenities ? hotelData.amenities.map(a => ({
                        name: a.amenityName,
                        icon: getAmenityIcon(a.amenityName)
                    })) : [],
                    rooms: hotelData.rooms ? hotelData.rooms.map(r => ({
                        id: r.roomId,
                        name: r.roomName,
                        price: r.pricePerNight,
                        guests: r.capacity,
                        size: r.area || 30,
                        description: r.description,
                        images: (r.images && r.images.length > 0) 
                            ? r.images.map(img => getFullImageUrl(img))
                            : ["https://via.placeholder.com/400x300?text=Room+Image"], 
                        amenities: r.amenities ? r.amenities.reduce((acc, curr) => ({...acc, [curr]: true}), {}) : {}
                    })) : []
                };

                setHotel(mappedHotel);
                setPolicies(policyData);

            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Không thể tải thông tin. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [hotelId, dateRange]);

    // Handlers
    const openImageViewer = (index) => {
        setSelectedImageIndex(index);
        setViewerOpen(true);
    };

    const handleCloseRoomDetail = () => {
        setSelectedRoomDetail(null);
    };

    // Scroll Spy
    useEffect(() => {
        const handleScroll = () => {
            // Danh sách các ID section cần theo dõi
            const sections = ["overview", "rooms", "policies", "reviews"];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Nếu phần tử nằm trong khoảng nhìn thấy (offset top 300px)
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) return <div className="flex justify-center items-center h-[80vh] bg-gray-50"><Spinner size="lg" /></div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!hotel) return null;

    const imagesForModal = hotel.images.map((imgUrl, index) => ({
        url: imgUrl,
        caption: `${hotel.name} - Ảnh ${index + 1}`
    }));

    return (
        <div className="bg-gray-100 min-h-screen pb-20">
            
            {/* 1. Header & Gallery */}
            <HotelHeader hotel={hotel} onOpenGallery={openImageViewer} />

            {/* 2. Sticky Nav */}
            <HotelStickyNav activeSection={activeSection} />

            {/* 3. Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* CỘT TRÁI (Nội dung chính) */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* A. Tổng quan & Tiện nghi (Gộp chung trong HotelOverview) */}
                        <HotelOverview description={hotel.description} amenities={hotel.amenities} />

                        {/* B. Danh sách Phòng */}
                        <section id="rooms" className="scroll-mt-32">
                             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                Phòng trống
                                <span className="text-xs font-normal text-white bg-red-500 px-2 py-1 rounded-full animate-pulse">Hot!</span>
                            </h3>
                            <RoomListSection 
                                rooms={hotel.rooms} 
                                onRoomInfoClick={setSelectedRoomDetail} 
                                dateRange={dateRange}
                                onChangeDate={setDateRange}
                            />
                        </section>

                        {/* ✅ ĐÃ XÓA PHẦN AMENITIES BỊ TRÙNG LẶP Ở ĐÂY */}

                        {/* C. Chính sách */}
                        <HotelPolicies policies={policies} />

                        {/* D. Đánh giá */}
                        <section id="reviews" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 scroll-mt-32">
                             <ReviewsSection />
                        </section>

                    </div>

                    {/* CỘT PHẢI (Sidebar) */}
                    <HotelSidebar 
                        location={hotel.location} 
                        rating={hotel.rating} 
                        minPrice={hotel.rooms[0]?.price} 
                        lat={hotel.latitude} // Truyền lat
                        lng={hotel.longitude} // Truyền lng
                    />
                </div>
            </div>

            {/* Modals */}
            <RoomDetailModal
                room={selectedRoomDetail}
                open={!!selectedRoomDetail}
                onClose={handleCloseRoomDetail}
            />

            <ImageViewerModal
                open={isViewerOpen}
                onClose={() => setViewerOpen(false)}
                images={imagesForModal}
                startIndex={selectedImageIndex}
            />
        </div>
    );
}