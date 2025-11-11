import React from "react";
import {
    LineChart,
    LogIn,
    LogOut,
    CircleDollarSign
} from "lucide-react";

const stats = [
    {
        id: 1,
        title: "Công suất phòng (Hôm nay)",
        value: "78%",
        emoji: <LineChart className="text-blue-500" />,
        change: "+5% so với hôm qua",
    },
    {
        id: 2,
        title: "Check-in hôm nay",
        value: "32",
        emoji: <LogIn className="text-green-500" />,
        change: "12 khách dự kiến",
    },
    {
        id: 3,
        title: "Check-out hôm nay",
        value: "21",
        emoji: <LogOut className="text-red-500" />,
        change: "8 khách đã trả phòng",
    },
    {
        id: 4,
        title: "Doanh thu (Hôm nay)",
        value: "120.5M",
        emoji: <CircleDollarSign className="text-yellow-600" />,
        change: "+15M so với hôm qua",
    },
];

const HotelStatCard = ({ title, value, emoji, change }) => (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
            <span className="text-3xl">{emoji}</span>
        </div>
        <div className="mt-4">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{value}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{change}</p>
        </div>
    </div>
);

const HotelStatCards = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <HotelStatCard
                    key={stat.id}
                    title={stat.title}
                    value={stat.value}
                    emoji={stat.emoji}
                    change={stat.change}
                />
            ))}
        </div>
    );
};

export default HotelStatCards;
