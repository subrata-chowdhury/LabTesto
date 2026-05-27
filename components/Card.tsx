// components/Card.tsx
import React from "react";

type Props = {
  label: string;
  value: number;
  className?: string;
  colors?: {
    lineColor?: string;
    iconBgColor?: string;
  };
};

export default function Card({
  label = "",
  value = 0,
  className = "",
  colors = { lineColor: "#f97316", iconBgColor: "rgba(249, 115, 22, 0.1)" }, // Defaulting to the orange brand theme
}: Props) {
  return (
    <div
      className={`group relative overflow-hidden flex flex-col justify-between border border-gray-100 dark:border-white/5 rounded-3xl shadow-lg shadow-black/5 hover:shadow-xl dark:shadow-none dark:hover:shadow-white/2 bg-white dark:bg-[#111] p-6 transition-all duration-300 w-full min-h-[140px] ${className}`}
    >
      {/* Background reveal effect */}
      <div
        className="transition-all duration-700 w-0 aspect-square top-0 left-0 rounded-full group-hover:w-[250%] absolute group-hover:top-[-50%] group-hover:left-[-50%] -z-10"
        style={{ backgroundColor: colors.iconBgColor, opacity: 0.3 }}
      ></div>

      <div className="flex justify-between items-start z-10 gap-4">
        <div className="flex flex-col justify-between h-full">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide">
            {label}
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-primary dark:text-white mt-2 group-hover:text-primary transition-colors">
            {formatValue(value)}
          </div>
        </div>

        <div
          className="w-14 h-14 shrink-0 rounded-2xl flex justify-center items-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-black/5 dark:border-white/5"
          style={{ backgroundColor: colors.iconBgColor }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M19.4299 1.71484H19.278C18.5653 1.71484 17.9053 2.11586 17.5123 2.78711C17.3688 3.03227 16.9898 3.06156 16.8101 2.84406C16.212 2.11586 15.4177 1.71484 14.5685 1.71484C13.7252 1.71484 12.9312 2.11586 12.3323 2.84406C12.1687 3.04328 11.8343 3.04375 11.6698 2.84359C11.0709 2.11586 10.2769 1.71484 9.43359 1.71484C8.59031 1.71484 7.79625 2.11586 7.19742 2.84406C7.01789 3.06344 6.63914 3.03273 6.49547 2.78711C6.10172 2.11586 5.44172 1.71484 4.72922 1.71484H4.55977C3.46078 1.71484 2.56641 2.60922 2.56641 3.7082V20.2928C2.56641 21.3918 3.46078 22.2862 4.55977 22.2862H4.72922C5.44148 22.2862 6.10148 21.8852 6.49594 21.213C6.6382 20.968 7.01695 20.9366 7.19742 21.1572C7.79625 21.8849 8.59031 22.2859 9.43359 22.2859C10.2769 22.2859 11.0709 21.8849 11.6698 21.1567C11.8343 20.957 12.1687 20.9575 12.3323 21.1572C12.9312 21.8849 13.7252 22.2859 14.5744 22.2859C15.4177 22.2859 16.2122 21.8849 16.8098 21.1577C16.991 20.9383 17.3698 20.9702 17.512 21.213C17.9055 21.8852 18.5655 22.2862 19.2783 22.2862H19.4302C20.5291 22.2862 21.4235 21.3918 21.4235 20.2928V3.70844C21.4235 2.60922 20.5289 1.71484 19.4299 1.71484ZM19.7091 20.2928C19.7091 20.4468 19.5839 20.572 19.4299 20.572H19.278C19.1341 20.572 19.0223 20.3999 18.9914 20.3467C18.608 19.6926 17.899 19.2862 17.1415 19.2862C16.4986 19.2862 15.8955 19.5712 15.4859 20.0688C15.3314 20.2567 15.0075 20.5717 14.5685 20.5717C14.1354 20.5717 13.811 20.2563 13.6566 20.0688C12.84 19.0738 11.163 19.0736 10.3455 20.0683C10.1911 20.2563 9.86672 20.5717 9.43359 20.5717C9.00047 20.5717 8.67609 20.2563 8.52164 20.0688C8.11313 19.5712 7.50961 19.2862 6.86648 19.2862C6.10805 19.2862 5.39906 19.693 5.01656 20.3467C4.98562 20.3995 4.87336 20.572 4.72945 20.572H4.56C4.40602 20.572 4.28086 20.4468 4.28086 20.2928V3.70844C4.28086 3.55445 4.40602 3.4293 4.56 3.4293H4.72945C4.87336 3.4293 4.98563 3.6018 5.01609 3.65359C5.39906 4.3082 6.10805 4.71508 6.86648 4.71508C7.50984 4.71508 8.11336 4.43008 8.52164 3.93273C8.67609 3.74477 9.00047 3.4293 9.43359 3.4293C9.86672 3.4293 10.1911 3.74477 10.3455 3.93227C11.163 4.92789 12.84 4.92672 13.6566 3.93273C13.811 3.74477 14.1354 3.4293 14.5744 3.4293C15.0075 3.4293 15.3314 3.74453 15.4863 3.9332C15.8955 4.43008 16.4988 4.71508 17.1415 4.71508C17.899 4.71508 18.608 4.30867 18.9919 3.65359C19.0223 3.60133 19.1341 3.4293 19.278 3.4293H19.4299C19.5839 3.4293 19.7091 3.55445 19.7091 3.70844V20.2928Z"
              fill={colors.lineColor}
            />
            <path
              d="M5.99633 12.8571H14.5677V14.5713H5.99633V12.8571ZM5.99609 16.2853H17.9919V17.9995H5.99609V16.2853ZM14.5653 7.71422H15.9247L13.9595 9.67969L15.1714 10.8916L17.1369 8.92641V10.2858H18.8511V6H14.5653V7.71422Z"
              fill={colors.lineColor}
            />
          </svg>
        </div>
      </div>

      {/* Accent Bottom Line */}
      <div
        className="absolute bottom-0 left-0 h-1 w-full opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: colors.lineColor }}
      ></div>
    </div>
  );
}

function formatValue(value: number): string {
  if (value >= 10000000) {
    return (value / 10000000).toFixed(1).replace(/\.0$/, "") + "C";
  } else if (value >= 100000) {
    return (value / 100000).toFixed(1).replace(/\.0$/, "") + "L";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return value.toString();
}
