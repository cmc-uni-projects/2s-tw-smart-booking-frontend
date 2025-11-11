import React from "react";

const arrivals = [
    { id: 1, name: "Nguyễn Văn An", roomType: "Deluxe Kingg", eta: "14:00", status: "Đã xác nhận" },
    { id: 2, name: "Trần Thị Bích", roomType: "Standard Queen", eta: "14:30", status: "Đã xác nhận" },
    { id: 3, name: "Michael Page", roomType: "Suite", eta: "15:00", status: "Chưa xác nhận" },
    { id: 4, name: "Gia đình Kim (3)", roomType: "Family Room", eta: "16:15", status: "Đã xác nhận" },
    { id: 5, name: "Lê Minh Tuấn", roomType: "Standard King", eta: "18:00", status: "Đã xác nhận" },
];

const UpcomingArrivalsTable = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Khách sắp check-in (Hôm nay)
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tên khách</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Loại phòng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Giờ dự kiến</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {arrivals.map((arrival) => (
                            <tr key={arrival.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{arrival.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{arrival.roomType}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{arrival.eta}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${arrival.status === "Đã xác nhận" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                        }`}>
                                        {arrival.status}
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

export default UpcomingArrivalsTable;
