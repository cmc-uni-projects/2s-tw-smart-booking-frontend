import React from "react";
import { useTranslation } from "react-i18next";

// Demo data: type/status are translation keys under owner:HousekeepingTasks
const tasks = [
    { id: 1, room: "201", type: "cleaningCheckOut", status: "pending" },
    { id: 2, room: "305", type: "extraTowelsRequested", status: "inProgress" },
    { id: 3, room: "510", type: "cleaningScheduled", status: "pending" },
    { id: 4, room: "102", type: "brokenTv", status: "reportedToMaintenance" },
    { id: 5, room: "208", type: "cleaningCheckOut", status: "done" },
];

const STATUS_CLASS = {
    pending: "bg-yellow-100 text-yellow-800",
    inProgress: "bg-blue-100 text-blue-800",
    reportedToMaintenance: "bg-red-100 text-red-800",
    done: "bg-green-100 text-green-800",
};
const getStatusClass = (status) => STATUS_CLASS[status] || "bg-gray-100 text-gray-800";

const HousekeepingTasks = () => {
  const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 h-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("owner:HousekeepingTasks.housekeepingMaintenanceTasks")}
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t("owner:HousekeepingTasks.room")}</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t("owner:HousekeepingTasks.task")}</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t("owner:HousekeepingTasks.status")}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{task.room}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{t(`owner:HousekeepingTasks.${task.type}`)}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(task.status)}`}>
                                        {t(`owner:HousekeepingTasks.${task.status}`)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HousekeepingTasks;
