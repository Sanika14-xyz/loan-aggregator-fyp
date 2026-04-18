const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-[#0F766E] text-[#1E3A8A] hover:bg-[#b8943e] font-bold",
    secondary: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-200",
    danger: "bg-red-500 text-white hover:bg-red-600 font-semibold",
    ghost: "bg-transparent text-white hover:bg-white/10 border border-white/20",
  };
  return (
    <button
      className={`px-5 py-2.5 rounded-lg transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;