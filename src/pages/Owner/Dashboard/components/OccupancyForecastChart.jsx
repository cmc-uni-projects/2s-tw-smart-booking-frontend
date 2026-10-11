import React from "react";
import { useTranslation } from "react-i18next";

const OccupancyForecastChart = () => {
  const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("owner:OccupancyForecastChart.occupancyForecastNext7Days")}
            </h3>
            <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">
                    {t("owner:OccupancyForecastChart.placeholderForTheForecastChart")}
                </p>
            </div>
        </div>
    );
};

export default OccupancyForecastChart;
