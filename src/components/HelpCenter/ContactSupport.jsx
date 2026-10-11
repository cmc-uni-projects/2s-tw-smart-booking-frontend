// src/components/HelpCenter/ContactSupport.jsx
import React from 'react';
import { Mail, Phone } from 'lucide-react'; // Bỏ import MessageCircle
import { useTranslation } from "react-i18next";

const ContactSupport = () => {
    const { t } = useTranslation("help");
    return (
        <div className="bg-slate-50 py-16 px-4 border-t border-gray-200">
            <div className="max-w-4xl mx-auto"> {/* Giảm max-w để 2 card gọn hơn */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900">{t("contact.title")}</h2>
                    <p className="text-gray-600 mt-2">{t("contact.subtitle")}</p>
                </div>

                {/* CẬP NHẬT: Đổi grid-cols-3 thành grid-cols-2 và chỉnh gap */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">

                    {/* Card Email */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-all group">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Mail className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">{t("contact.email")}</h3>
                        <p className="text-gray-500 text-sm mb-4">{t("contact.emailText")}</p>
                        <a href="mailto:support@travelmate.com" className="text-blue-600 font-medium hover:underline text-lg">
                            support@travelmate.com
                        </a>
                    </div>

                    {/* Card Hotline */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-all group">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 text-orange-600 rounded-full mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <Phone className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">Hotline 24/7</h3>
                        <p className="text-gray-500 text-sm mb-4">{t("contact.hotlineText")}</p>
                        <a href="tel:19001234" className="text-orange-600 font-bold text-2xl hover:underline">
                            1900 1234
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactSupport;