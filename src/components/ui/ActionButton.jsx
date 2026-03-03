import { motion } from 'framer-motion';

const variants = {
  edit: 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700',
  delete: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50',
};

export default function ActionButton({
  variant = 'edit',
  'aria-label': ariaLabel,
  children,
  className = '',
  ...props
}) {
  const variantClass = variants[variant] || variants.edit;
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-2 rounded transition-colors ${variantClass} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </motion.button>
  );
}
