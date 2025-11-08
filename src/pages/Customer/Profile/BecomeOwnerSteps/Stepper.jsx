import React from "react";
import { Check } from "lucide-react";

const steps = [
    { id: 1, name: "Thông tin cá nhân" },
    { id: 2, name: "Giấy phép kinh doanh" },
    { id: 3, name: "Hoàn tất" },
];

export default function Stepper({ currentStep = 1 }) {
    return (
        <nav aria-label="Progress">
            {/* Căn giữa toàn bộ thanh stepper */}
            <ol className="flex items-center justify-center p-4 md:p-6">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <li
                            key={step.name}
                            className={`relative ${
                                // ✅ THAY ĐỔI 1: Tăng khoảng cách (padding-right)
                                // Bạn có thể tăng số 32 và 64 lên nữa nếu muốn
                                index < steps.length - 1 ? "pr-32 sm:pr-64" : ""
                            }`}
                        >
                            {/* 1. Đường kẻ (sẽ nằm BÊN DƯỚI vòng tròn) */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute inset-0 top-1/2 -translate-y-1/2 h-0.5 w-full ${
                                        isCompleted ? "bg-[rgb(40,169,224)]" : "bg-gray-200"
                                    }`}
                                    aria-hidden="true"
                                />
                            )}

                            {/* 2. Vòng tròn số (sẽ nằm TRÊN đường kẻ)
                 "relative" đảm bảo nó render trên "absolute" line
              */}
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full font-medium">
                                {isCompleted ? (
                                    // Bước đã qua: Nền xanh che đường kẻ
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(40,169,224)]">
                    <Check className="h-5 w-5 text-white" />
                  </span>
                                ) : isCurrent ? (
                                    // Bước hiện tại: Nền trắng che đường kẻ
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[rgb(40,169,224)] bg-white text-[rgb(40,169,224)]">
                    {step.id}
                  </span>
                                ) : (
                                    // Bước chưa tới: Nền xám che đường kẻ
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    {step.id}
                  </span>
                                )}
                            </div>

                            {/* ✅ THAY ĐỔI 2: Căn giữa chữ (text)
                 Vòng tròn rộng w-8 (2rem), tâm của nó là 1rem (left-4).
                 Dùng "left-4 -translate-x-1/2" để căn giữa text.
              */}
                            <p
                                className={`absolute -bottom-6 left-4 -translate-x-1/2 text-center text-xs font-medium ${
                                    isCurrent ? "text-[rgb(40,169,224)]" : "text-gray-500"
                                } whitespace-nowrap`}
                            >
                                {step.name}
                            </p>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}