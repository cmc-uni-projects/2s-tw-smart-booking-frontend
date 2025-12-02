import React from "react";

import HotelStatCards from "./components/HotelStatCards"; 
import HotelRevenueChart from "./components/HotelRevenueChart"; 
import DailyActivityFeed from "./components/DailyActivityFeed"; 
import OccupancyForecastChart from "./components/OccupancyForecastChart"; 
import RoomStatusOverview from "./components/RoomStatusOverview"; 
import RecentReviewsWidget from "./components/RecentReviewsWidget"; 
import HousekeepingTasks from "./components/HousekeepingTasks"; 

const OwnerDashboard = () => {
    return (
        <div className="space-y-6">
            <HotelStatCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <HotelRevenueChart />
                </div>
                <div className="lg:col-span-1">
                    <DailyActivityFeed />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OccupancyForecastChart />
                <RoomStatusOverview />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <RecentReviewsWidget />
                </div>
                <div className="lg:col-span-2">
                    <HousekeepingTasks />
                </div>
            </div>

          

        </div>
    );
};

export default OwnerDashboard;