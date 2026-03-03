import Button from './Button';

export default function Pagination({
  startIndex,
  endIndex,
  total,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className = '',
  showInfo = true,
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center gap-2 flex-wrap ${className}`}
    >
      {showInfo && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {total > 0 ? `${startIndex}-${endIndex} of ${total}` : '0 of 0'}
        </p>
      )}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrevious}
          disabled={currentPage <= 1}
        >
          {previousLabel}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onNext}
          disabled={currentPage >= totalPages}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
