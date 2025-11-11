import React from "react";

// Dữ liệu giả
const reviews = [
    { id: 1, user: "Anh Trầnn", rating: 5, text: "Vị trí tuyệt vời, nhân viên thân thiện. Sẽ quay lại!" },
    { id: 2, user: "Chị Lê", rating: 4, text: "Phòng ốc sạch sẽ, đồ ăn sáng ổn. Hồ bơi hơi nhỏ." },
    { id: 3, user: "David (US)", rating: 5, text: "Amazing service. The concierge was extremely helpful." },
];

const renderStars = (rating) => {
    let stars = "";
    for (let i = 0; i < 5; i++) {
        stars += i < rating ? "★" : "☆";
    }
    return <span className="text-yellow-500">{stars}</span>;
};

const RecentReviewsWidget = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 h-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Đánh giá gần đây
            </h3>
            <ul className="space-y-4">
                {reviews.map((review) => (
                    <li key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{review.user}</span>
                            {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{review.text}"</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentReviewsWidget;
