import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";


const members = [
    { name: "Từ Phải Sang Trái", role: "Leader", email: "thai@gamil.com" },
    { name: "Quang J97", role: "Developer", email: "quangmtp@gmail.com" },
    { name: "Lê Công Tôn Sách", role: "Developer", email: "binhphaptontu@gmail.com" },
    { name: "Trang Hoàn Lương", role: "Developer", email: "trang@gmail.com" },
    { name: "Đào Quang Thành", role: "Developer", email: "qthanh@gmail.com" },
    { name: "Bùi Tiến Thành", role: "Developer", email: "flhoangde@gmail.com" },
];


function Avatar({ name }) {
    const initials = name
        .split(" ")
        .map(part => part[0] || "")
        .slice(-2)
        .join("")
        .toUpperCase();
    return (
        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {initials}
        </div>
    );
}

const Contact = () => {
    return (
        <section className="py-16 bg-gray-50" id="contact">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Liên hệ & Hỗ trợ</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-blue-600">Thông tin liên hệ</h3>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-center gap-3">
                                <Phone className="text-blue-500" size={20} />
                                <span>Hotline: +84 329044969</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-blue-500" size={20} />
                                <span>Email: quangmtp@smarttravel.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin className="text-blue-500" size={20} />
                                <span>Địa chỉ: CMC GLOBAL</span>
                            </li>
                        </ul>

                        <p className="mt-6 text-gray-600">Hỗ trợ 24/7 – sẵn sàng đồng hành cùng chuyến đi của bạn.</p>
                    </div>


                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-blue-600">Đội ngũ phát triển</h3>
                        <p className="text-gray-600 mb-4">Nhóm phát triển dự án — 2STW.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {members.map((member, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition">
                                    <Avatar name={member.name} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-gray-800">{member.name}</h4>
                                            <span className="text-sm text-gray-500">{member.role}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">{member.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
