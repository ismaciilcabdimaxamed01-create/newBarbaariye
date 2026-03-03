import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-[#0f3d5e] text-white hover:bg-[#0a2a3d] dark:bg-[#1e5a7e] dark:hover:bg-[#0f3d5e]',
  secondary:
    'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 1 }}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0f3d5e] focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  );
}
