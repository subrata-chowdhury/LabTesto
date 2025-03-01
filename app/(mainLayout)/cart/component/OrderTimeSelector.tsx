import Dropdown from "@/components/Dropdown";
import Model from "@/components/Model";
import { useState } from "react";
import { toast } from "react-toastify";


export default function OrderTimeSelector({ onClose, onChange }: { onClose: () => void, onChange: (sampleTakenDateTime: { start: Date, end: Date }) => void }) {
    const now = new Date();
    const minTime = now.getHours() >= 18 ? new Date(now.setDate(now.getDate() + 1)).setHours(6, 0, 0, 0) : new Date(now.setHours(Math.max(now.getHours() + 1, 6), 0, 0, 0));

    const [sampleStartTime, setSampleStartTime] = useState<Date>(new Date(minTime));
    const [sampleEndTime, setSampleEndTime] = useState<Date>(new Date(minTime));

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        setSampleStartTime(new Date(newDate.setHours(sampleStartTime.getHours(), sampleStartTime.getMinutes())));
        setSampleEndTime(new Date(newDate.setHours(sampleEndTime.getHours(), sampleEndTime.getMinutes())));
    };

    return (
        <Model heading='Schedule Order Times' onClose={onClose}>
            <div className='px-7 py-4 pt-6 pb-5 min-w-80 text-sm'>
                <div className='font-medium text-base mb-2'>Pick Date</div>
                <div>
                    <input type="date" className="px-3 py-2 border-2 rounded" value={sampleStartTime.toISOString().split('T')[0]} onChange={handleDateChange} />
                </div>
                <div className='font-medium text-base mb-2 mt-4'>Duration</div>
                <div className="flex gap-2 justify-between">
                    <div className="w-full">
                        <div>From</div>
                        <Dropdown
                            width="100%"
                            value={sampleStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            options={(() => {
                                const times = [];
                                for (let i = 0; i <= 24; i++) {
                                    const time = new Date(0, 0, 0, 6, 0 + i * 30);
                                    times.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
                                }
                                return times;
                            })()}
                            onChange={(opt: { value: string | number, index: number }) => {
                                const [time, period] = (opt.value as string).split(' ');
                                const hrMin = time.split(':').map(Number);
                                let hours = hrMin[0];
                                const minutes = hrMin[1];
                                if (period === 'pm' && hours < 12) hours += 12;
                                if (period === 'am' && hours === 12) hours = 0;
                                const newStartTime = new Date(sampleStartTime);
                                newStartTime.setHours(hours, minutes);
                                setSampleStartTime(newStartTime);
                            }} />
                    </div>
                    <div className="w-full">
                        <div>To</div>
                        <Dropdown
                            width="100%"
                            value={sampleEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            options={(() => {
                                const times = [];
                                for (let i = 0; i <= 24; i++) {
                                    const time = new Date(0, 0, 0, 6, 0 + i * 30);
                                    times.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
                                }
                                return times;
                            })()}
                            onChange={(opt: { value: string | number, index: number }) => {
                                const [time, period] = (opt.value as string).split(' ');
                                const hrMin = time.split(':').map(Number);
                                let hours = hrMin[0];
                                const minutes = hrMin[1];
                                if (period === 'pm' && hours < 12) hours += 12;
                                if (period === 'am' && hours === 12) hours = 0;
                                const newEndTime = new Date(sampleEndTime);
                                newEndTime.setHours(hours, minutes);
                                setSampleEndTime(newEndTime);
                            }} />
                    </div>
                </div>
            </div>
            <div className='flex justify-end pb-8 px-7'>
                <button
                    className="bg-[#3986ba] text-white px-5 py-2 rounded"
                    onClick={() => {
                        if (sampleStartTime && sampleEndTime && sampleStartTime < sampleEndTime) {
                            onChange(
                                { start: sampleStartTime, end: sampleEndTime },
                            );
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