import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { format, addDays, isValid } from 'date-fns';
import { 
    MapPin, Star, Wifi, Waves, ParkingCircle, Utensils, 
    Droplet, Users, Wind, Check, Coffee, Tv 
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

const TABS = [
    { id: "rooms", name: "Phòng" },
    { id: "reviews", name: "Đánh Giá Của Khách" },
    { id: "amenities", name: "Tiện nghi" },
    { id: "policies", name: "Chính Sách" },
];

export default function HotelDetailPage() {
    const { hotelId } = useParams();
    const [searchParams] = useSearchParams();
    
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State ngày tháng
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 1)
    });

    // ✅ BUG FIX: Đồng bộ dateRange khi URL SearchParams thay đổi
    // Nếu không có đoạn này, khi user đổi ngày tìm kiếm ở trang Search và click vào hotel,
    // state cũ (ngày cũ) vẫn được giữ nguyên -> API gọi ngày cũ -> Phòng vẫn bị ẩn.
    useEffect(() => {
        const checkInParam = searchParams.get("checkIn");
        const checkOutParam = searchParams.get("checkOut");

        if (checkInParam && checkOutParam) {
            const start = new Date(checkInParam);
            const end = new Date(checkOutParam);
            // Kiểm tra valid date để tránh lỗi
            if (isValid(start) && isValid(end)) {
                setDateRange({ startDate: start, endDate: end });
            }
        }
    }, [searchParams]); 

    // State cho Gallery Modal
    const [isViewerOpen, setViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);
    const [activeTab, setActiveTab] = useState("rooms");

    // Gọi API lấy chi tiết
    useEffect(() => {
        const fetchHotelDetail = async () => {
            if (!hotelId) return;
            setLoading(true);
            try {
                const checkInStr = format(dateRange.startDate, "yyyy-MM-dd");
                const checkOutStr = format(dateRange.endDate, "yyyy-MM-dd");

                // Gọi API (Backend sẽ lọc phòng dựa trên checkIn/checkOut)
                const data = await propertyService.getPropertyDetail(hotelId, checkInStr, checkOutStr);
                
                const mappedHotel = {
                    id: data.propertyId,
                    name: data.propertyName,
                    description: data.description,
                    rating: data.rating,
                    reviewsCount: data.reviewCount,
                    location: `${data.address}, ${data.city}`,
                    images: (data.images && data.images.length > 0) 
                        ? data.images.map(getFullImageUrl)
                        : [getFullImageUrl(data.coverImage)],
                    amenities: data.amenities ? data.amenities.map(a => ({
                        name: a.amenityName,
                        icon: getAmenityIcon(a.amenityName)
                    })) : [],
                    rooms: data.rooms ? data.rooms.map(r => ({
                        id: r.roomId,
                        name: r.roomName,
                        price: r.pricePerNight,
                        guests: r.capacity,
                        size: r.area || 30,
                        beds: "Tiêu chuẩn",
                        description: r.description,
                        images: (r.images && r.images.length > 0) 
                            ? r.images.map(img => getFullImageUrl(img))
                            : ["https://via.placeholder.com/400x300?text=Room+Image"], 
                        amenities: r.amenities ? r.amenities.reduce((acc, curr) => ({...acc, [curr]: true}), {}) : {}
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

        fetchHotelDetail();
    }, [hotelId, dateRange]); // Chạy lại khi ID hoặc dateRange thay đổi

    const openImageViewer = (index) => {
        setSelectedImageIndex(index);
        setViewerOpen(true);
    };

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

    const imagesForModal = hotel.images.map((imgUrl, index) => ({
        url: imgUrl,
        caption: `${hotel.name} - Ảnh ${index + 1}`
    }));

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            <ModernBreadcrumb items={breadcrumbItems} />

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

            <HotelGallery images={hotel.images} onOpenViewer={openImageViewer} />

            <div className="mt-8 space-y-8">
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Tổng quan</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {hotel.description}
                    </p>
                </Card>

                <div>
                    <div className="sticky top-16 z-30 bg-white shadow-sm border-b border-gray-100">
                        <div className="px-4 md:px-0">
                            <TabsComponent 
                                tabs={TABS} 
                                activeTab={activeTab} 
                                onTabChange={setActiveTab} 
                            />
                        </div>
                    </div>

                    <Card className="p-0 overflow-hidden !rounded-t-none border-t-0">
                        <div className="animate-fadeIn min-h-[300px]">
                            {activeTab === 'rooms' && (
                                <RoomListSection 
                                    rooms={hotel.rooms} 
                                    onRoomInfoClick={handleOpenRoomDetail}
                                    // Truyền dateRange để RoomListSection hiển thị đúng ngày đang chọn
                                    dateRange={dateRange}
                                    onChangeDate={setDateRange}
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
        </main>
    );
}