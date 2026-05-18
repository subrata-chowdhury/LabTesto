// Updated Skeleton to match the new TestCard layout
function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm p-6 animate-pulse">
      {/* Title */}
      <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-4/5 mb-3"></div>
      <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-2/5 mb-4"></div>

      {/* Badge */}
      <div className="w-24 h-6 bg-orange-50/50 dark:bg-orange-500/5 rounded-full mb-6 border border-orange-100/50 dark:border-orange-500/10"></div>

      {/* Details Box */}
      <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-6 space-y-4 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gray-200 dark:bg-white/10 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-32"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gray-200 dark:bg-white/10 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-28"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gray-200 dark:bg-white/10 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-4 flex justify-between items-center">
        <div>
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-12 mb-2"></div>
          <div className="h-6 bg-emerald-100 dark:bg-emerald-900/20 rounded w-16"></div>
        </div>
        <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-24"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
