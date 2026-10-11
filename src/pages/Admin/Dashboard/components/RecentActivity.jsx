import React from "react";
import Card from "../../../../components/common/Card/Card";
import CardHeader from "../../../../components/common/Card/CardHeader";
import Avatar from "../../../../components/common/Avatar/Avatar";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

// Dữ liệu mock
const activities = [
  {
    id: 1,
    user: "customer@travelmate.vn",
    get action() { return i18n.t("admin:RecentActivity.booked12345"); },
    get time() { return i18n.t("admin:RecentActivity.n2MinutesAgo"); },
  },
  {
    id: 2,
    user: "owner@travelmate.vn",
    get action() { return i18n.t("admin:RecentActivity.updatedRoomPricesAtSunrise"); },
    get time() { return i18n.t("admin:RecentActivity.n15MinutesAgo"); },
  },
  {
    id: 3,
    user: "admin@travelmate.vn",
    get action() { return i18n.t("admin:RecentActivity.lockedTheAccountOfUser"); },
    get time() { return i18n.t("admin:RecentActivity.n1HourAgo"); },
  },
  {
    id: 4,
    get user() { return i18n.t("admin:RecentActivity.aNewHotel"); },
    get action() { return i18n.t("admin:RecentActivity.isAwaitingApproval"); },
    get time() { return i18n.t("admin:RecentActivity.n3HoursAgo"); },
  },
];

const RecentActivity = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader
        title={t("admin:RecentActivity.recentActivity")}
        icon={<Bell className="text-[rgb(40,169,224)]" />}
      />
      <div className="space-y-4 max-h-80 overflow-y-auto mt-2">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <Avatar name={item.user} size={36} className="mt-1" />
            <div className="text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">{item.user}</span> {item.action}
              </p>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;