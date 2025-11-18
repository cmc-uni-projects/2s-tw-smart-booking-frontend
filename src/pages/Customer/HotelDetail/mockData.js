import { Wifi, Waves, ParkingCircle, Utensils, Droplet, Users } from "lucide-react";

export const mockImages = [
    "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/12/19/1128932/312606256_1243871556.jpg",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    "https://images.unsplash.com/photo-1611892440504-4cb0296a1a19",
    "https://images.unsplash.com/photo-1590490359854-dfc809fd2686",
];

export const MOCK_DETAIL = {
    id: 1,
    name: "The Ocean Resort",
    location: "Võ Nguyên Giáp, Đà Nẵng",
    rating: 9.2,
    reviewsCount: 1480,
    description: "Tọa lạc tại vị trí đắc địa bên bờ biển Mỹ Khê...",
    images: mockImages,
    amenities: [
        { name: "Wifi miễn phí", icon: <Wifi size={18}/> },
        { name: "Hồ bơi", icon: <Waves size={18}/> },
        { name: "Chỗ đỗ xe", icon: <ParkingCircle size={18}/> },
        { name: "Nhà hàng", icon: <Utensils size={18}/> },
        { name: "Spa", icon: <Droplet size={18}/> },
        { name: "Phòng gym", icon: <Users size={18}/> },
    ],
    rooms: [
        {
            id: 101,
            name: "Phòng Deluxe Hướng Biển",
            price: 2200000,
            guests: 2,
            size: 35,
            beds: "1 giường King",
            available: 5,
            description: "Phòng Deluxe 35m² có ban công riêng...",
            amenities: { tv: true, ac: true, wifi: true, bathtub: true, minibar: true, balcony: true },
            images: [ mockImages[2], mockImages[4], mockImages[1], mockImages[3] ]
        },
        {
            id: 102,
            name: "Phòng Suite Gia Đình",
            price: 3500000,
            guests: 4,
            size: 50,
            beds: "2 giường Queen",
            available: 3,
            description: "Suite gia đình rộng 50m²...",
            amenities: { tv: true, ac: true, wifi: true, tea_coffee: true, non_smoking: true },
            images: [ mockImages[1], mockImages[5], mockImages[0], mockImages[2] ]
        },
    ],
};