import React from "react";
import PropTypes from "prop-types";
import { Crown, Medal, Award, Shield } from "lucide-react";

export default function UserRankBadge({ rank }) {
    // Chuẩn hóa dữ liệu đầu vào
    const normalizedRank = rank ? rank.toUpperCase() : "BRONZE";

    const getRankConfig = (r) => {
        switch (r) {
            case "DIAMOND":
                return {
                    label: "Kim Cương",
                    bg: "bg-purple-100",
                    text: "text-purple-700",
                    border: "border-purple-200",
                    icon: <Crown size={14} className="fill-current" />
                };
            case "GOLD":
                return {
                    label: "Vàng",
                    bg: "bg-yellow-100",
                    text: "text-yellow-700",
                    border: "border-yellow-200",
                    icon: <Medal size={14} className="fill-current" />
                };
            case "SILVER":
                return {
                    label: "Bạc",
                    bg: "bg-slate-100",
                    text: "text-slate-600",
                    border: "border-slate-200",
                    icon: <Award size={14} />
                };
            case "BRONZE":
            default:
                return {
                    label: "Đồng",
                    bg: "bg-orange-50",
                    text: "text-orange-700",
                    border: "border-orange-100",
                    icon: <Shield size={14} />
                };
        }
    };

    const config = getRankConfig(normalizedRank);

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.bg} ${config.border} ${config.text}`}>
            {config.icon}
            <span className="text-xs font-semibold">{config.label}</span>
        </div>
    );
}

UserRankBadge.propTypes = {
    rank: PropTypes.string,
};