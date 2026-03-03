import { motion } from 'framer-motion';

export default function Card({ children, className = '', animate = true, ...props }) {
  const baseClass = 'rounded-xl bg-white shadow-md dark:bg-slate-800 dark:shadow-slate-900/50';

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${baseClass} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
