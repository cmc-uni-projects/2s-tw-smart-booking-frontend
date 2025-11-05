import React from "react";

const Partners = () => {
    const partners = [
        {
            name: "Agoda",
            logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Agoda_logo.svg",
        },
        {
            name: "Booking.com",
            logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Booking.com_logo.svg",
        },
        {
            name: "Traveloka",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Traveloka_logo.svg",
        },
        {
            name: "Expedia",
            logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Expedia_Logo.svg",
        },
        {
            name: "Tripadvisor",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Tripadvisor_Logo_circle-green_horizontal-lockup_registered.svg",
        },
    ];

    return (
        <section className="py-16 bg-gray-50 text-center">
            <div className="max-w-6xl mx-auto px-6">
                {/* Tiêu đề */}
                <h2 className="text-3xl font-semibold mb-10 text-blue-700">
                    Đối tác du lịch
                </h2>

                {/* Mô tả */}
                <p className="text-gray-600 mb-10 text-lg">
                    Chúng tôi tự hào hợp tác cùng các thương hiệu hàng đầu trong lĩnh vực
                    du lịch để mang đến trải nghiệm tốt nhất cho bạn.
                </p>

                {/* Danh sách logo đối tác */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-center">
                    {partners.map((partner) => (
                        <div
                            key={partner.name}
                            className="p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition transform hover:scale-105 flex items-center justify-center"
                        >
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="h-10 object-contain grayscale hover:grayscale-0 transition duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;
