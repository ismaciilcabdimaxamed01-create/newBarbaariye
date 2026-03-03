export default function ErrorAlert({
  message,
  hint,
  onDismiss,
  className = '',
}) {
  return (
    <div
      className={`mx-4 mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm ${className}`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          {message}
          {hint && <p className="mt-2 text-xs opacity-80">{hint}</p>}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 p-1 rounded hover:bg-red-200/50 dark:hover:bg-red-800/30 transition-colors"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
