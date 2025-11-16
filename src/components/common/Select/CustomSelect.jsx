import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Component Select tùy chỉnh đẹp mắt, đồng bộ với TextField.
 * @param {string} label - Nhãn (nếu có).
 * @param {any} value - Giá trị hiện tại đang được chọn.
 * @param {function} onChange - Hàm callback khi chọn giá trị mới.
 * @param {Array<{label: string, value: any}>} options - Danh sách các lựa chọn.
 * @param {string} placeholder - Chữ hiển thị khi chưa có giá trị.
 */
const CustomSelect = ({ label, value, onChange, options, placeholder = "Chọn..." }) => {
  // Tìm 'label' của 'value' đang được chọn để hiển thị
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          {/* Đây là nút bấm, được style cho giống TextField */}
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <span className="block truncate">
              {selectedOption ? selectedOption.label : <span className="text-gray-400">{placeholder}</span>}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown
                size={20}
                className="text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          
          {/* Đây là phần danh sách (panel) xổ xuống */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <Check size={16} aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomSelect;