function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
          {title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default FeatureItem;
