import React from "react";
import AboutSystem from "./AboutSystem";
import Partners from "./Partners";
import Commitments from "./Commitments";
import Contact from "./Contact.jsx";


const About = () => {
    return (
        <div className="w-full bg-gray-50 text-gray-800">
            <section className="bg-blue-600 text-white py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">Về Chúng Tôi</h1>
                <p className="text-lg max-w-2xl mx-auto">
                    Nền tảng du lịch thông minh giúp kết nối khách hàng với hàng ngàn khách sạn uy tín,SIGMA.
                </p>
            </section>

            {/* Các phần nội dung */}
            <AboutSystem />
            <Partners />
            <Commitments />
            <Contact />

        </div>
    );
};

export default About;
