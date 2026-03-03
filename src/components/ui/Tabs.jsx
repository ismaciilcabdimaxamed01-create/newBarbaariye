export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) {
  return (
    <div
      className={`
        flex items-center gap-2 overflow-x-auto
        scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        ${className}
      `}
      role="tablist"
      aria-label="Tabs"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`
              flex-none inline-flex items-center justify-center gap-2.5
              py-2.5 px-4 text-[0.9rem] font-medium cursor-pointer rounded-xl
              transition-all duration-200 whitespace-nowrap border
              shadow-sm
              ${
                isActive
                  ? 'bg-[#0B3C5D] text-white border-[#0B3C5D] shadow-[0_4px_12px_rgba(11,60,93,0.28)]'
                  : 'bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:text-[#0B3C5D] dark:hover:text-teal-300 hover:border-[#0B3C5D]/30 hover:shadow-[0_2px_10px_rgba(11,60,93,0.12)]'
              }
            `}
            onClick={() => onTabChange(tab.id)}
          >
            {Icon && <Icon size={16} className="shrink-0 opacity-95" aria-hidden="true" />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
