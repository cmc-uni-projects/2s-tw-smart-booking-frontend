import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";
import Button from "@/components/common/Button/Button";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import { useTranslation } from "react-i18next";



// Text lives in about.json under commitments.items.<key>
const COMMITMENT_KEYS = ["safety", "refund", "privacy", "support"];

export default function Commitments() {
    const { t } = useTranslation("about");
    const commitments = COMMITMENT_KEYS.map((key) => ({
        key,
        title: t(`commitments.items.${key}.title`),
        shortDesc: t(`commitments.items.${key}.short`),
        fullDesc: t(`commitments.items.${key}.full`),
    }));
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleOpen = (item) => {
        setSelected(item.key);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelected(null);
    };

    const selectedItem = commitments.find((c) => c.key === selected);

    return (
        <section className="py-16 bg-gray-50 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-10">
                {t("commitments.title")}
            </h2>


            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {commitments.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleOpen(item)}
                        className="cursor-pointer bg-white shadow-md rounded-2xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                        <h3 className="text-lg font-semibold text-blue-600 mb-3">
                            {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3">{item.shortDesc}</p>
                        <p className="text-blue-500 text-xs mt-3 font-medium underline">
                            {t("commitments.viewDetails")}
                        </p>
                    </div>
                ))}
            </div>


            <ModalPortal>
                <AnimatePresence>
                    {open && selectedItem && (
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 40, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-md overflow-hidden"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                                    <h3 className="text-lg font-semibold text-[rgb(40,169,224)]">
                                        {selectedItem.title}
                                    </h3>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="px-6 py-5 space-y-4 text-gray-700 text-left max-h-[60vh] overflow-y-auto">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="text-blue-500" size={22} />
                                        <p className="font-medium">{selectedItem.title}</p>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                        {selectedItem.fullDesc}
                                    </p>
                                </div>


                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </ModalPortal>
        </section>
    );
}
