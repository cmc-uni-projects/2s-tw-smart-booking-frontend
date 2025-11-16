import React from 'react';

/**
 * Component TextField mới, đồng bộ style với CustomSelect.
 * @param {string | JSX.Element} label - Nhãn (có thể là JSX để chứa dấu *)
 * @param {JSX.Element} icon - Icon (hiển thị bên trái)
 * @param {object} props - Các props còn lại (value, name, onChange, ...)
 */
const StyledTextField = ({ label, icon, ...props }) => {
  
  // Class CSS cơ bản (giống CustomSelect)
  const baseClasses = [
    "block w-full rounded-lg border border-gray-300 bg-white shadow-sm",
    "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
    "sm:text-sm"
  ].join(" ");
  
  // Class padding: py-2.5 (để cao bằng CustomSelect)
  // pl-10 nếu có icon, pl-3 nếu không có.
  const paddingClasses = icon ? "py-2.5 pl-10 pr-3" : "py-2.5 px-3";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Icon (nếu có) */}
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {/* Clone icon để thêm class text-gray-400 */}
            {React.cloneElement(icon, { className: 'text-gray-400', size: 16 })}
          </div>
        )}
        <input
          id={props.name}
          className={`${baseClasses} ${paddingClasses}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default StyledTextField;