import React from "react";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import { Bed, Maximize, Wifi, User, XCircle, CheckCircle } from "lucide-react";

const RoomRow = ({ room, onInfoClick }) => {
    return (
        <Card className="p-4 !shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                {/* 1. Thông tin & Ảnh */}
                <div className="col-span-10 lg:col-span-4">
                    <h4
                        className="text-base font-semibold text-[rgb(40,169,224)] mb-2 line-clamp-2 cursor-pointer hover:underline"
                        onClick={() => onInfoClick(room)}
                    >
                        {room.name}
                    </h4>
                    <button
                        type="button"
                        className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 group/image"
                        onClick={() => onInfoClick(room)}
                    >
                        <img
                            src={room.images[0]}
                            alt={room.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-110"
                        />
                        {room.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
                                + {room.images.length - 1} ảnh
                            </div>
                        )}
                    </button>
                    <div className="space-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5"><Bed size={14} /> {room.beds}</span>
                        <span className="flex items-center gap-1.5"><Maximize size={14} /> {room.size} m²</span>
                        <span className="flex items-center gap-1.5"><Wifi size={14} /> Wi-Fi miễn phí</span>
                    </div>
                    <button
                        className="text-sm text-[rgb(40,169,224)] font-medium mt-1 hover:underline"
                        onClick={() => onInfoClick(room)}
                    >
                        Thông Tin Phòng
                    </button>
                </div>

                {/* 2. Tóm tắt */}
                <div className="col-span-10 lg:col-span-2 border-b lg:border-b-0 lg:border-l lg:border-r border-gray-200 px-0 lg:px-4 py-4 lg:py-0 flex flex-col justify-center">
                    <div className="space-y-1.5 text-sm">
                        <Badge color="success" icon={false}>Giá tốt nhất hôm nay!</Badge>
                        <span className="flex items-center gap-2 text-red-600"><XCircle size={15} /> Không Hoàn Tiền</span>
                        <span className="flex items-center gap-2 text-green-600"><CheckCircle size={15} /> Xác nhận ngay</span>
                        <span className="flex items-center gap-2 text-gray-700"><CheckCircle size={15} /> Thanh toán trước</span>
                    </div>
                </div>

                {/* 3. Sức chứa */}
                <div className="col-span-3 lg:col-span-1 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center justify-center gap-1 text-black">
                        <User size={20} />
                        <span className="text-xl font-medium text-gray-800">x{room.guests}</span>
                    </div>
                </div>

                {/* 4. Giá */}
                <div className="col-span-7 lg:col-span-3 flex flex-col items-end justify-between text-right h-full border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-4">
                    <div>
                        <div>
                            <Badge color="danger">Giảm 80%</Badge>
                            <span className="text-gray-500 line-through text-sm ml-1.5">
                                {(room.price * 1.8).toLocaleString('vi-VN')}₫
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-red-600 mt-1">
                            {room.price.toLocaleString('vi-VN')}₫
                        </p>
                        <span className="text-xs text-gray-500">đã gồm thuế & phí / đêm</span>
                    </div>
                    <Button size="md" className="w-full mt-2">Đặt</Button>
                </div>
            </div>
        </Card>
    );
};

export default RoomRow;