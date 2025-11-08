import React from "react";

const HotelRevenueChart = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 h-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Doanh thu khách sạn (7 ngày qua)
            </h3>
            <div className="flex items-center justify-center h-80 bg-gray-50 dark:bg-gray-700 rounded-md">
                {/* Thẻ [Image] này sẽ hiển thị một biểu đồ cột mẫuu */}

                <p className="text-gray-500 dark:text-gray-400">
                    (Placeholder cho Biểu đồ doanh thu)
                </p>
            </div>
        </div>
    );
};

export default HotelRevenueChart;
