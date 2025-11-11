import React from "react";

import {
    ConciergeBell,
    LogIn,
    Sparkles,
    LogOut,
    FileText
} from "lucide-react";

const activities = [
    {
        id: 1,
        text: "Khách (P. 301) yêu cầu dịch vụ phòng",
        time: "2 phút trước",
        emoji: <ConciergeBell className="text-blue-500" />
    },
    {
        id: 2,
        text: "Bà Nguyễn Thu Trang (P. 505) đã check-in.",
        time: "15 phút trước",
        emoji: <LogIn className="text-green-500" />
    },
    {
        id: 3,
        text: "Phòng 201 đã được dọn dẹp.",
        time: "45 phút trước",
        emoji: <Sparkles className="text-cyan-500" />
    },
    {
        id: 4,
        text: "Ông John Smith (P. 102) đã check-out.",
        time: "1 giờ trước",
        emoji: <LogOut className="text-red-500" />
    },
    {
        id: 5,
        text: "Booking mới từ Agoda cho 2 đêm.",
        time: "1 giờ trước",
        emoji: <FileText className="text-purple-500" />
    },
];

const DailyActivityFeed = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 h-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Hoạt động trong ngày
            </h3>
            <ul className="space-y-4">
                {activities.map((activity) => (
                    <li key={activity.id} className="flex items-start space-x-3">
                        {/* Kích thước icon sẽ được kiểm soát bởi class 'text-xl' */}
                        <span className="text-xl mt-1">{activity.emoji}</span>
                        <div>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{activity.text}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DailyActivityFeed;
