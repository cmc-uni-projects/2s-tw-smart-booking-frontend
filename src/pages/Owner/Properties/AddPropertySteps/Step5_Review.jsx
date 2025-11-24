import React from "react";
import { Info, MapPin, Sparkles, Image, ClipboardList } from "lucide-react";
import ReviewImagePreview from "./components/ReviewImagePreview";
import { Link } from "react-router-dom";

// Component con hiển thị dòng thông tin
const ReviewItem = ({ label, value }) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <p className="text-sm font-medium text-gray-900 text-right max-w-[70%]">{value || "(Chưa nhập)"}</p>
    </div>
);

// Component Header cho Card
const ReviewHeader = ({ icon, title }) => (
    <h3 className="flex items-center gap-2 p-4 font-semibold text-gray-800 border-b border-gray-200 bg-gray-50">
        {icon}
        {title}
    </h3>
);

// Component hiển thị lưới ảnh
const ImageGrid = ({ fileList }) => {
    if (!fileList || fileList.length === 0) {
        return <p className="text-sm text-gray-500 italic p-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">Chưa tải lên ảnh nào</p>;
    }
    const files = Array.from(fileList);

    return (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-2">
            {files.map((file, index) => (
                <ReviewImagePreview key={index} file={file} />
            ))}
        </div>
    );
};

export default function Step5_Review({ watch, register, errors }) {
    const data = watch();

    // ============================================================
    // LOGIC HIỂN THỊ ĐỊA CHỈ THÔNG MINH (SMART DISPLAY)
    // ============================================================
    const getDisplayAddress = () => {
        let addr = data.address || "";
        const province = data.province || "";
        const city = data.city || ""; // Quận/Huyện
        const ward = data.ward || ""; // Phường/Xã

        // Chuẩn hóa chuỗi để so sánh (viết thường)
        const addrLower = addr.toLowerCase();
        const provinceLower = province.toLowerCase().replace("thành phố", "").replace("tỉnh", "").trim();
        
        // Kiểm tra: Nếu địa chỉ chi tiết (address) đã chứa tên Tỉnh (do Mapbox điền)
        // thì coi như nó đã đầy đủ, không cần nối thêm.
        if (provinceLower && addrLower.includes(provinceLower)) {
             return addr;
        }

        // Ngược lại (Nhập tay): Nối các phần còn thiếu vào
        // Chỉ nối những phần chưa xuất hiện trong address
        const parts = [];
        
        // Nếu address chưa có Ward thì thêm Ward
        if (ward && !addrLower.includes(ward.toLowerCase())) parts.push(ward);
        
        // Nếu address chưa có City (Quận) thì thêm City
        if (city && !addrLower.includes(city.toLowerCase())) parts.push(city);
        
        // Luôn thêm Tỉnh và Quốc gia nếu nhập tay
        parts.push(province);
        parts.push(data.country || "Việt Nam");

        // Lọc bỏ rỗng và nối chuỗi
        const suffix = parts.filter(p => p && p.trim() !== "").join(", ");
        
        return suffix ? `${addr}, ${suffix}` : addr;
    };

    const displayAddress = getDisplayAddress();
    // ============================================================

    const amenities = data.amenities
        ? Object.keys(data.amenities).filter(k => data.amenities[k]) 
        : [];

    return (
        <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div>
                <h2 className="text-xl font-bold text-gray-800">
                    Kiểm tra lại thông tin
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Hãy đảm bảo mọi thông tin đều chính xác trước khi gửi cho chúng tôi xem xét.
                </p>
            </div>

            {/* 1. Thông tin chung & Vị trí */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <ReviewHeader icon={<MapPin size={18} className="text-blue-500" />} title="Thông tin cơ bản" />
                <div className="p-5 space-y-1">
                    <ReviewItem label="Tên cơ sở" value={data.propertyName} />
                    <ReviewItem label="Loại hình" value={data.propertyType} />
                    <ReviewItem label="Diện tích" value={data.area ? `${data.area} m²` : ""} />
                    
                    {/* Hiển thị địa chỉ đã xử lý */}
                    <ReviewItem label="Địa chỉ hiển thị" value={displayAddress} />
                    
                    <div className="py-3 border-b border-gray-100 last:border-b-0">
                         <span className="text-sm font-medium text-gray-500 block mb-1">Mô tả giới thiệu</span>
                         <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg italic">
                            {data.description || "(Chưa nhập mô tả)"}
                         </p>
                    </div>
                </div>
            </div>

            {/* 2. Tiện nghi */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <ReviewHeader icon={<Sparkles size={18} className="text-blue-500" />} title="Tiện nghi & Dịch vụ" />
                <div className="p-5">
                    {amenities.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {amenities.map((amenity) => (
                                <span key={amenity} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100 uppercase">
                                    {amenity.replace("_", " ")}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm italic">(Chưa chọn tiện nghi nào)</p>
                    )}
                </div>
            </div>

            {/* 3. Hình ảnh */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <ReviewHeader icon={<Image size={18} className="text-blue-500" />} title="Hình ảnh thực tế" />
                <div className="p-5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Ảnh tổng quan ({data.propertyImages?.length || 0})</h4>
                    <ImageGrid fileList={data.propertyImages} />
                </div>
            </div>

            {/* 4. Điều khoản */}
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="terms"
                        {...register("terms")}
                        className="w-5 h-5 mt-0.5 accent-blue-600 cursor-pointer"
                    />
                    <div>
                        <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer select-none">
                            Tôi cam kết rằng các thông tin và hình ảnh cung cấp ở trên là chính xác và thuộc quyền sở hữu hợp pháp. Tôi đồng ý với{" "}
                            <Link to="/owner/terms-of-service" target="_blank" className="text-blue-600 font-medium hover:underline">
                                Điều khoản dịch vụ
                            </Link>{" "}
                            và{" "}
                            <Link to="/owner/partner-policy" target="_blank" className="text-blue-600 font-medium hover:underline">
                                Chính sách đối tác
                            </Link>{" "}
                            của TravelMate.
                        </label>
                        {errors.terms && (
                            <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1">
                                <Info size={12}/> {errors.terms.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="text-center text-xs text-gray-400 pb-4">
                Đơn đăng ký của bạn sẽ được đội ngũ quản trị viên của TravelMate xem xét và phản hồi trong vòng 48h làm việc.
            </div>
        </div>
    );
}