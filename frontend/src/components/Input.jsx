const Input = ({ label, dark = false, className = "", ...props }) => {
  const baseClasses = dark
    ? "w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
    : "w-full px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30";
  const labelClasses = dark
    ? "block text-sm font-medium text-blue-200 mb-1"
    : "block text-sm font-medium text-neutral-800 mb-1";
  return (
    <div className="mb-1">
      {label && <label className={labelClasses}>{label}</label>}
      <input className={`${baseClasses} ${className}`} {...props} />
    </div>
  );
};
export default Input;