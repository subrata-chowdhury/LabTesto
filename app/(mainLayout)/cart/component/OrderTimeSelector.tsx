import Dropdown from "@/components/Dropdown";
import Model from "@/components/Model";
import { useRef, useState } from "react";
import { toast } from "react-toastify";


export default function OrderTimeSelector({ onClose, onChange }: { onClose: () => void, onChange: (sampleTakenDateTime: { start: Date, end: Date }) => void }) {
    const sampleStartTime = useRef<Date | null>(null)
    const sampleEndTime = useRef<Date | null>(null)
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState<string>('');

    return (
        <Model heading='Schedule Order Times' onClose={onClose}>
            <div className='px-7 py-4 pt-6 pb-5 min-w-80 text-sm'>
                <div className='font-medium text-base mb-2'>Pick Date</div>
                <div>
                    <input type="date" className="px-3 py-2 border-2 rounded" min={new Date().toISOString().split('T')[0]} value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className='font-medium text-base mb-2 mt-4'>Duration</div>
                <div className="flex gap-2 justify-between">
                    <Dropdown
                        width="100%"
                        value={duration}
                        options={(() => {
                            const times = [];
                            let minHr = 0;
                            if (new Date().getDate() === new Date(date).getDate() &&
                                new Date().getMonth() === new Date(date).getMonth() &&
                                new Date().getFullYear() === new Date(date).getFullYear()) {
                                minHr = new Date().getHours() - 5;
                            }
                            for (let i = minHr; i <= 12; i++) {
                                const time = new Date(0, 0, 0, 6 + i, 0);
                                const time2 = new Date(0, 0, 0, 6 + i, 30);
                                times.push(`${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${time2.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`);
                            }
                            return times;
                        })()}
                        onChange={(opt: { value: string | number, index: number }) => {
                            let minHr = 0;
                            if (new Date().getDate() === new Date(date).getDate() &&
                                new Date().getMonth() === new Date(date).getMonth() &&
                                new Date().getFullYear() === new Date(date).getFullYear()) {
                                minHr = new Date().getHours() - 5;
                            }
                            const time = new Date(date);
                            const time2 = new Date(date);
                            time.setHours(6 + minHr + opt.index, 0);
                            time2.setHours(6 + minHr + opt.index, 30);
                            sampleStartTime.current = (new Date(time));
                            sampleEndTime.current = (new Date(time2));
                            setDuration(opt.value as string);
                        }} />
                </div>
            </div>
            <div className='flex justify-end pb-8 px-7'>
                <button
                    className="bg-primary text-white px-5 py-2 rounded"
                    onClick={() => {
                        if (sampleStartTime.current && sampleEndTime.current && sampleStartTime.current < sampleEndTime.current) {
                            onChange({ start: sampleStartTime.current, end: sampleEndTime.current });
                            onClose();
                        } else {
                            toast.error('Please ensure the start time is before the end time for both sample taken and report delivery.');
                        }
                    }}
                >
                    Schedule
                </button>
            </div>
        </Model>
    );
}