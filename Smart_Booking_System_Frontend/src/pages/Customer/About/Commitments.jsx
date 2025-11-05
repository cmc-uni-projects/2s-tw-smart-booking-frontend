import React from "react";
import { ShieldCheck, Clock, CreditCard, Headphones } from "lucide-react";

const Commitments = () => {
    const commitments = [
        {
            icon: <ShieldCheck className="w-10 h-10 text-blue-600 mb-3" />,
            title: "Đảm bảo an toàn & uy tín",
            desc: "Tất cả khách sạn và đối tác đều được xác minh kỹ lưỡng, đảm bảo thông tin minh bạch và an toàn cho khách hàng.",
        },
        {
            icon: <CreditCard className="w-10 h-10 text-blue-600 mb-3" />,
            title: "Thanh toán linh hoạt & bảo mật",
            desc: "Chúng tôi hỗ trợ các phương thức thanh toán ... .",
        },
        {
            icon: <Clock className="w-10 h-10 text-blue-600 mb-3" />,
            title: "Hỗ trợ 24/7 & phản hồi nhanh",
            desc: "Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ bạn mọi lúc, giúp quá trình đặt phòng diễn ra suôn sẻ.",
        },
        {
            icon: <Headphones className="w-10 h-10 text-blue-600 mb-3" />,
            title: "Chính sách hoàn tiền minh bạch",
            desc: "Cam kết hoàn tiền rõ ràng theo quy định từng khách sạn và gói dịch vụ, bảo vệ quyền lợi khách hàng tối đa.",
        },
    ];

    return (
        <section className="py-16 bg-white text-center">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-semibold mb-10 text-blue-700">
                    Cam kết & Chính sách
                </h2>

                <p className="text-gray-600 mb-12 text-lg">
                    Chúng tôi đặt trải nghiệm của khách hàng lên hàng đầu.
                </p>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {commitments.map((item, index) => (
                        <div
                            key={index}
                            className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
                        >
                            {item.icon}
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Commitments;
