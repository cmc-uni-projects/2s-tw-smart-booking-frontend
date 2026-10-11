import React from "react";
import { useTranslation } from "react-i18next";

const AboutSystem = () => {
    const { t } = useTranslation("about");
    return (
        <section className="py-16 px-6 bg-white text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-blue-700">
                    {t("system.title")}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    {t("system.intro")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="p-6 shadow-md rounded-2xl hover:shadow-xl transition">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/825/825529.png"
                            alt="Smart booking"
                            className="w-16 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-medium mb-2">{t("system.smartTitle")}</h3>
                        <p className="text-gray-600">
                            {t("system.smartText")}
                        </p>
                    </div>

                    <div className="p-6 shadow-md rounded-2xl hover:shadow-xl transition">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/2950/2950653.png"
                            alt="Secure payment"
                            className="w-16 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-medium mb-2">{t("system.payTitle")}</h3>
                        <p className="text-gray-600">
                            {t("system.payText")}
                        </p>
                    </div>

                    <div className="p-6 shadow-md rounded-2xl hover:shadow-xl transition">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
                            alt="24/7 support"
                            className="w-16 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-medium mb-2">{t("system.supportTitle")}</h3>
                        <p className="text-gray-600">
                            {t("system.supportText")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSystem;