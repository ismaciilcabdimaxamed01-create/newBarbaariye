import { Search } from 'lucide-react';

export default function SearchInput({
  placeholder = 'Search...',
  icon: Icon = Search,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={`relative flex-1 w-full min-w-0 sm:max-w-xs isolate ${className}`}>
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="search"
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f3d5e] focus:border-transparent text-sm ${inputClassName}`}
        {...props}
      />
    </div>
  );
}
