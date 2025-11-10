// src/components/common/Tabs/TabsComponent.jsx

import React from 'react';

// TabsComponent là một thành phần điều hướng đơn giản
export default function TabsComponent({ tabs, activeTab, onTabChange }) {
    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200
                            
                            ${activeTab === tab.id
                            // Tab đang hoạt động: border xanh, chữ xanh
                            ? 'border-[rgb(40,169,224)] text-[rgb(40,169,224)]'
                            // Tab không hoạt động: border trong suốt, chữ xám, hover đẹp hơn
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-blue-300'
                        }
                            
                            /* ✅ THÊM HIỆU ỨNG FOCUS VÀ CHUYỂN ĐỘNG NHẸ */
                            focus:outline-none focus:ring-2 focus:ring-[rgb(40,169,224,0.3)] rounded-t-lg
                        `}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                        {tab.name}
                    </button>
                ))}
            </nav>
        </div>
    );
}