// src/components/ui/button.jsx
export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-900",
    ghost: "hover:bg-gray-100 text-gray-900",
  };
  const classes = `${base} ${variants[variant] || variants.primary} ${className}`;
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
