import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export default function Badge({ children, color = "primary", icon }) {
  const colors = {
    primary: "text-[rgb(40,169,224)] bg-[rgb(40,169,224,0.15)]",
    success: "text-green-600 bg-green-100",
    warning: "text-yellow-600 bg-yellow-100",
    danger: "text-red-600 bg-red-100",
    gray: "text-gray-600 bg-gray-100",
  };

  const icons = {
    primary: <Info size={14} />,
    success: <CheckCircle size={14} />,
    warning: <AlertTriangle size={14} />,
    danger: <XCircle size={14} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full ${colors[color]} shadow-sm`}
    >
      {icon !== false && icons[color]}
      {children}
    </span>
  );
}
