function MiniInfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2.5 items-center border border-gray-100 dark:border-white/10 rounded-xl p-2 sm:p-2.5 bg-gray-50/50 dark:bg-[#1a1a1a]">
      <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">
          {label}
        </div>
        <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
          {value}
        </div>
      </div>
    </div>
  );
}

export default MiniInfoCard;
