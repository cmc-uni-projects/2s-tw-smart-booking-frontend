export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(40,169,224,0.2)] disabled:opacity-70 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const variants = {
    primary: "bg-[rgb(40,169,224)] text-white hover:bg-[rgb(26,140,189)]",
    outline:
      "border border-[rgb(40,169,224)] text-[rgb(40,169,224)] bg-white hover:bg-[rgb(40,169,224,0.08)]",
    ghost:
      "text-[rgb(40,169,224)] hover:bg-[rgb(40,169,224,0.08)]",
  };

  return (
    <button
      {...props}
      className={`${base} ${sizes[size]} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {isLoading ? (
        <span className="animate-pulse">Đang xử lý...</span>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
