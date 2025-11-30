import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { format, addDays } from 'date-fns';
import { 
    MapPin, Wifi, Waves, ParkingCircle, Utensils, 
    Droplet, Users, Wind, Check, Coffee, Tv, Star
} from "lucide-react";

// Components Common
import Spinner from "@/components/common/Loading/Spinner";
import ImageViewerModal from "@/pages/Admin/Hotels/components/ImageViewerModal";
import Button from "@/components/common/Button/Button";

// Sub-components
import HotelHeader from "./components/HotelHeader";
import HotelStickyNav from "./components/HotelStickyNav";
import HotelOverview from "./components/HotelOverview";
import HotelPolicies from "./components/HotelPolicies";
import HotelSidebar from "./components/HotelSidebar";
import RoomListSection from "./components/RoomListSection";
import RoomDetailModal from "./components/RoomDetailModal";
import BookingDateModal from "./components/BookingDateModal";

// Import Sidebar Review
import HotelReviewSidebar from "./components/HotelReviewSidebar"; 

// Import Auth Context
import { useAuth } from "@/context/AuthContext";

// Service
import propertyService from "@/services/property.service";
import bookingService from "@/services/booking.service";

// --- HELPERS & CONSTANTS ---
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");

const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x600?text=No+Image";
    if (path.startsWith("http")) return path;
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (!cleanPath.startsWith('/uploads')) cleanPath = `/uploads${cleanPath}`;
    return `${BASE_URL}${cleanPath}`;
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
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Auth & Permission Check
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === "ADMIN" || currentUser?.roles?.includes("ADMIN");

    // --- DEBUG LOG ---
    useEffect(() => {
        console.log("=== HotelDetailPage Mounted ===");
        console.log("Hotel ID:", hotelId);
    }, [hotelId]);

    const [hotel, setHotel] = useState(null);
    const [policies, setPolicies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [dateRange, setDateRange] = useState({
        startDate: searchParams.get("checkIn") ? new Date(searchParams.get("checkIn")) : new Date(),
        endDate: searchParams.get("checkOut") ? new Date(searchParams.get("checkOut")) : addDays(new Date(), 1)
    });

    const [isViewerOpen, setViewerOpen] = useState(false);
    const [viewerImages, setViewerImages] = useState([]); 
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);
    const [activeSection, setActiveSection] = useState("overview");

    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
    const [occupiedDates, setOccupiedDates] = useState([]);

    const [isReviewSidebarOpen, setIsReviewSidebarOpen] = useState(false);

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
                    ownerId: hotelData.ownerId, // ✅ Đã lấy ownerId ở đây
                    name: hotelData.propertyName,
                    description: hotelData.description,
                    rating: hotelData.rating,
                    reviewsCount: hotelData.reviewCount,
                    location: `${hotelData.address}, ${hotelData.city}`,
                    latitude: hotelData.latitude, 
                    longitude: hotelData.longitude, 
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

    // ✅ 1. THÊM LOGIC CHECK QUYỀN OWNER (Sau khi có data hotel)
    const isOwner = currentUser && hotel && String(currentUser.userId) === String(hotel.ownerId);

    // --- HANDLERS ---

    const openHotelGallery = (index) => {
        if (!hotel || !hotel.images) return;
        const images = hotel.images.map((imgUrl, i) => ({
            url: imgUrl,
            caption: `${hotel.name} - Ảnh ${i + 1}`
        }));
        setViewerImages(images); 
        setSelectedImageIndex(index);
        setViewerOpen(true);
    };

    const openReviewGallery = (index, rawImages) => {
        if (!rawImages || rawImages.length === 0) return;
        const images = rawImages.map((imgUrl, i) => ({
            url: getFullImageUrl(imgUrl), 
            caption: `Ảnh đánh giá ${i + 1}`
        }));
        setViewerImages(images);
        setSelectedImageIndex(index);
        setViewerOpen(true);
    };

    const handleCloseRoomDetail = () => {
        setSelectedRoomDetail(null);
    };

    const handleBookNowClick = async (room) => {
        setSelectedRoomForBooking(room);
        try {
            const res = await bookingService.getRoomAvailability(room.id);
            if (res && res.data) {
                setOccupiedDates(res.data);
            } else {
                setOccupiedDates([]);
            }
        } catch (error) {
            console.error("Lỗi lấy lịch bận:", error);
            setOccupiedDates([]);
        }
        setIsDateModalOpen(true);
    };

    const handleDateConfirm = (dateRange) => {
        setIsDateModalOpen(false);
        navigate(`/booking/${hotelId}`, { 
            state: {
                selectedRoomId: selectedRoomForBooking.id,
                checkInDate: dateRange[0],
                checkOutDate: dateRange[1]
            }
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["overview", "rooms", "policies", "reviews"];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
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

    return (
        <div className="bg-gray-100 min-h-screen pb-20 relative">
            
            <HotelHeader hotel={hotel} onOpenGallery={openHotelGallery} />

            <HotelStickyNav 
                activeSection={activeSection} 
                onReviewClick={() => setIsReviewSidebarOpen(true)}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div className="lg:col-span-8 space-y-8">
                        <HotelOverview description={hotel.description} amenities={hotel.amenities} />

                        <section id="rooms" className="scroll-mt-32">
                             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                Phòng trống
                                <span className="text-xs font-normal text-white bg-red-500 px-2 py-1 rounded-full animate-pulse">Hot!</span>
                            </h3>
                            <RoomListSection 
                                rooms={hotel.rooms} 
                                onRoomInfoClick={setSelectedRoomDetail} 
                                onBookNow={handleBookNowClick} 
                            />
                        </section>

                        <HotelPolicies policies={policies} />

                        <section id="reviews" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 scroll-mt-32">
                             <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                <div className="bg-yellow-50 p-4 rounded-full">
                                    <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">{hotel.rating || 0} / 5</h3>
                                    <p className="text-slate-500">Dựa trên {hotel.reviewsCount || 0} đánh giá</p>
                                </div>
                                <Button 
                                    onClick={() => setIsReviewSidebarOpen(true)}
                                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 flex items-center gap-2"
                                >
                                    Xem tất cả đánh giá
                                </Button>
                             </div>
                        </section>

                    </div>

                    <div className="lg:col-span-4">
                        <HotelSidebar 
                            location={hotel.location} 
                            rating={hotel.rating} 
                            minPrice={hotel.rooms[0]?.price} 
                            lat={hotel.latitude} 
                            lng={hotel.longitude} 
                        />
                    </div>
                </div>
            </div>

            <RoomDetailModal room={selectedRoomDetail} open={!!selectedRoomDetail} onClose={handleCloseRoomDetail} />

            <ImageViewerModal
                open={isViewerOpen}
                onClose={() => setViewerOpen(false)}
                images={viewerImages} 
                startIndex={selectedImageIndex}
            />

            {selectedRoomForBooking && (
                <BookingDateModal
                    open={isDateModalOpen}
                    onClose={() => setIsDateModalOpen(false)}
                    onConfirm={handleDateConfirm}
                    occupiedDates={occupiedDates}
                    roomPrice={selectedRoomForBooking.price}
                />
            )}

            {/* ✅ 2. TRUYỀN isOwner VÀO SIDEBAR */}
            <HotelReviewSidebar 
                isOpen={isReviewSidebarOpen}
                onClose={() => setIsReviewSidebarOpen(false)}
                propertyId={hotelId}
                isAdmin={isAdmin}
                isOwner={isOwner} // Truyền biến vừa tạo
                onOpenGallery={openReviewGallery} 
            />
        </div>
    );
}