// app/(mainLayout)/cart/component/OrderTimeSelector.tsx
import Dropdown from "@/components/Dropdown";
import Model from "@/components/Model";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export default function OrderTimeSelector({
  excludeTimes = [],
  onClose,
  onChange,
}: {
  excludeTimes?: string[];
  onClose: () => void;
  onChange: (sampleTakenDateTime: { start: Date; end: Date }) => void;
}) {
  const sampleStartTime = useRef<Date | null>(null);
  const sampleEndTime = useRef<Date | null>(null);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [duration, setDuration] = useState<string>("");

  return (
    <Model heading="Schedule Order Times" onClose={onClose}>
      <div className="px-6 py-6 min-w-[320px] w-full">
        <div className="mb-5">
          <label className="block font-semibold text-gray-900 dark:text-white mb-2 text-sm">
            Pick Date
          </label>
          <input
            type="date"
            className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setDuration(""); // Reset duration when date changes
            }}
          />
        </div>

        <div className="mb-2">
          <label className="block font-semibold text-gray-900 dark:text-white mb-2 text-sm">
            Duration Slot
          </label>
          <Dropdown
            width="100%"
            value={duration}
            options={(() => {
              const times = [];
              let minHr = 0;
              if (
                new Date().getDate() === new Date(date).getDate() &&
                new Date().getMonth() === new Date(date).getMonth() &&
                new Date().getFullYear() === new Date(date).getFullYear()
              ) {
                minHr = new Date().getHours() - 5;
              }
              for (let i = minHr; i <= 12; i++) {
                const time = new Date(0, 0, 0, 6 + i, 0);
                if (excludeTimes.includes(time.toTimeString().split(" ")[0]))
                  continue;
                const time2 = new Date(0, 0, 0, 6 + i, 30);
                times.push(
                  `${time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })} - ${time2.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`,
                );
              }
              return times;
            })()}
            onChange={(opt: { value: string | number; index: number }) => {
              let minHr = 0;
              if (
                new Date().getDate() === new Date(date).getDate() &&
                new Date().getMonth() === new Date(date).getMonth() &&
                new Date().getFullYear() === new Date(date).getFullYear()
              ) {
                minHr = new Date().getHours() - 5;
              }
              const time = new Date(date);
              const time2 = new Date(date);
              time.setHours(6 + minHr + opt.index, 0);
              time2.setHours(6 + minHr + opt.index, 30);
              sampleStartTime.current = new Date(time);
              sampleEndTime.current = new Date(time2);
              setDuration(opt.value as string);
            }}
          />
        </div>
      </div>

      <div className="flex justify-end pb-6 px-6 pt-2 border-t border-gray-100 dark:border-white/5 mt-2">
        <button
          className="w-full bg-primary hover:bg-blue-700 dark:bg-primary/90 dark:hover:bg-primary text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          onClick={() => {
            if (
              sampleStartTime.current &&
              sampleEndTime.current &&
              sampleStartTime.current < sampleEndTime.current
            ) {
              onChange({
                start: sampleStartTime.current,
                end: sampleEndTime.current,
              });
              onClose();
            } else {
              toast.error("Please select a valid time slot before scheduling.");
            }
          }}
        >
          Confirm Schedule
        </button>
      </div>
    </Model>
  );
}
