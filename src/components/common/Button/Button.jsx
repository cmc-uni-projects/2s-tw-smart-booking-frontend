import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[rgb(40,169,224,0.3)]";

  const variants = {
    primary:
      "bg-[rgb(40,169,224)] hover:bg-[rgb(30,140,190)] text-white shadow-sm hover:shadow-md",
    outline:
      "border border-[rgb(40,169,224)] text-[rgb(40,169,224)] hover:bg-[rgb(40,169,224)] hover:text-white",
    ghost:
      "text-[rgb(40,169,224)] hover:bg-[rgb(40,169,224,0.1)]",
    disabled:
      "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5 gap-1",
    md: "text-base px-5 py-2.5 gap-2",
    lg: "text-lg px-6 py-3 gap-2.5",
  };

  const cls = `${base} ${variants[disabled ? "disabled" : variant]} ${sizes[size]}`;

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.97 } : {}}
      disabled={disabled || isLoading}
      className={cls}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin mr-2" size={18} />
      ) : (
        leftIcon && <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
}
