import React from "react";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#006494] text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        {/* Giới thiệu */}
        <div>
          <h3 className="font-semibold text-lg mb-3">TravelMate</h3>
          <p className="text-sm text-gray-200 leading-relaxed">
            Nền tảng đặt phòng thông minh giúp bạn tìm kiếm, so sánh và đặt
            khách sạn chỉ trong vài cú nhấp chuột.
          </p>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h4 className="font-semibold mb-3">Liên kết nhanh</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:underline">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="/hotels" className="hover:underline">
                Khách sạn
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h4 className="font-semibold mb-3">Liên hệ</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} /> 0901 234 567
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@travelmate.vn
            </li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h4 className="font-semibold mb-3">Theo dõi chúng tôi</h4>
          <div className="flex gap-3">
            <a href="#" className="hover:text-blue-300">
              <Facebook />
            </a>
            <a href="#" className="hover:text-pink-300">
              <Instagram />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-t border-white/20 text-sm text-gray-200">
        © {new Date().getFullYear()} TravelMate. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
