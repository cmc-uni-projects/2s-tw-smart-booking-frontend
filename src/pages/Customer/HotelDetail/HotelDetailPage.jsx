import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
    MapPin, Star, Wifi, Waves, ParkingCircle, Utensils, 
    Droplet, Users, Wind, Check, Car, Coffee, Tv, Music 
} from "lucide-react";

// Components Common
import Spinner from "@/components/common/Loading/Spinner";
import Card from "@/components/common/Card/Card";
import Badge from "@/components/common/Badge/Badge";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import ImageViewerModal from "@/pages/Admin/Hotels/components/ImageViewerModal";

// Local Components
import HotelGallery from "./components/HotelGallery";
import RoomListSection from "./components/RoomListSection";
import RoomDetailModal from "./components/RoomDetailModal";
import { AmenitiesSection, ReviewsSection, PoliciesSection } from "./components/HotelInfoTabs";
import ModernBreadcrumb from "@/components/common/Breadcrumb/ModernBreadcrumb";

// Service
import propertyService from "@/services/property.service";

// --- HELPERS ---
const BASE_URL = "http://localhost:8386"; // Cần khớp với backend port

// Hàm ghép link ảnh đầy đủ
const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x600?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path}`;
};

// Hàm map tên tiện ích sang Icon
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
    
    return <Check size={18} />; // Icon mặc định
};

// Định nghĩa Tabs
const TABS = [
    { id: "rooms", name: "Phòng" },
    { id: "reviews", name: "Đánh Giá Của Khách" },
    { id: "amenities", name: "Tiện nghi" },
    { id: "policies", name: "Chính Sách" },
];

export default function HotelDetailPage() {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State cho Gallery Modal
    const [isViewerOpen, setViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // State cho Room Modal
    const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);

    // State cho Tab
    const [activeTab, setActiveTab] = useState("rooms");

    useEffect(() => {
        const fetchHotelDetail = async () => {
            setLoading(true);
            try {
                const data = await propertyService.getPropertyDetail(hotelId);
                
                // --- MAPPING DATA TỪ API SANG UI ---
                const mappedHotel = {
                    id: data.propertyId,
                    name: data.propertyName,
                    description: data.description,
                    rating: data.rating,
                    reviewsCount: data.reviewCount,
                    location: `${data.address}, ${data.city}`,
                    
                    // Xử lý ảnh
                    images: (data.images && data.images.length > 0) 
                        ? data.images.map(getFullImageUrl)
                        : [getFullImageUrl(data.coverImage)], // Fallback về cover nếu không có list ảnh

                    // Xử lý tiện ích
                    amenities: data.amenities ? data.amenities.map(a => ({
                        name: a.amenityName,
                        icon: getAmenityIcon(a.amenityName)
                    })) : [],

                    // Xử lý phòng
                    rooms: data.rooms ? data.rooms.map(r => ({
                        id: r.roomId,
                        name: r.roomName,
                        price: r.pricePerNight,
                        guests: r.capacity,
                        size: 30, // Hardcode tạm nếu backend chưa có field diện tích phòng
                        beds: "Tiêu chuẩn", // Hardcode tạm
                        description: r.description,
                        // Map ảnh phòng
                        images: (r.images && r.images.length > 0) 
                            ? r.images.map(img => getFullImageUrl(img))
                            : ["https://via.placeholder.com/400x300?text=Room+Image"], 
                        // Map tiện ích phòng (nếu backend trả về list string tên tiện ích)
                        amenities: {} 
                    })) : []
                };

                setHotel(mappedHotel);
            } catch (err) {
                console.error("Failed to load hotel:", err);
                setError("Không thể tải thông tin khách sạn. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        if (hotelId) {
            fetchHotelDetail();
        }
    }, [hotelId]);

    // Handlers Gallery
    const openImageViewer = (index) => {
        setSelectedImageIndex(index);
        setViewerOpen(true);
    };

    // Handlers Room Modal
    const handleOpenRoomDetail = (room) => setSelectedRoomDetail(room);
    const handleCloseRoomDetail = () => setSelectedRoomDetail(null);

    if (loading) return <div className="flex justify-center items-center h-[60vh]"><Spinner /></div>;
    
    if (error) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            <p className="mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-blue-500 hover:underline">Tải lại trang</button>
        </div>
    );

    if (!hotel) return <div className="text-center py-20">Không tìm thấy khách sạn.</div>;

    const breadcrumbItems = [
        { label: "Tìm kiếm", href: "/hotels" },
        { label: hotel.name },
    ];

    // Chuẩn hóa ảnh cho ImageViewer Modal
    const imagesForModal = hotel.images.map((imgUrl, index) => ({
        url: imgUrl,
        caption: `${hotel.name} - Ảnh ${index + 1}`
    }));

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            
            {/* 1. Breadcrumb */}
            <ModernBreadcrumb items={breadcrumbItems} />

            {/* 2. Header Info */}
            <div className="mt-4">
                <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-gray-600">
                    <Badge color="primary" icon={<Star size={14} className="fill-current" />}>
                        {hotel.rating || "New"} ({hotel.reviewsCount} đánh giá)
                    </Badge>
                    <div className="flex items-center gap-1.5 text-sm">
                        <MapPin size={16} className="text-[rgb(40,169,224)]" />
                        <span>{hotel.location}</span>
                    </div>
                </div>
            </div>

            {/* 3. Gallery */}
            <HotelGallery images={hotel.images} onOpenViewer={openImageViewer} />

            {/* 4. Main Content */}
            <div className="mt-8 space-y-8">
                
                {/* Card Mô tả ngắn */}
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Tổng quan</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {hotel.description}
                    </p>
                </Card>

                {/* 5. Tabs System */}
                <div>
                    {/* Sticky Tab Header */}
                    <div className="sticky top-16 z-30 bg-white shadow-sm border-b border-gray-100">
                        <div className="px-4 md:px-0">
                            <TabsComponent 
                                tabs={TABS} 
                                activeTab={activeTab} 
                                onTabChange={setActiveTab} 
                            />
                        </div>
                    </div>

                    {/* Tab Content */}
                    <Card className="p-0 overflow-hidden !rounded-t-none border-t-0">
                        <div className="animate-fadeIn min-h-[300px]">
                            {activeTab === 'rooms' && (
                                <RoomListSection 
                                    rooms={hotel.rooms} 
                                    onRoomInfoClick={handleOpenRoomDetail} 
                                />
                            )}
                            {activeTab === 'reviews' && <ReviewsSection />}
                            {activeTab === 'amenities' && (
                                <AmenitiesSection 
                                    amenities={hotel.amenities} 
                                    description={hotel.description} 
                                />
                            )}
                            {activeTab === 'policies' && <PoliciesSection />}
                        </div>
                    </Card>
                </div>
            </div>

            {/* --- MODALS --- */}
            
            {/* Room Detail Modal */}
            <RoomDetailModal
                room={selectedRoomDetail}
                open={!!selectedRoomDetail}
                onClose={handleCloseRoomDetail}
            />

            {/* Image Viewer Modal */}
            <ImageViewerModal
                open={isViewerOpen}
                onClose={() => setViewerOpen(false)}
                images={imagesForModal}
                startIndex={selectedImageIndex}
            />
        </main>
    );
}
