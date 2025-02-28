import DateInput from "@/components/Inputs/DateInput";
import Model from "@/components/Model";
import { useState } from "react";
import { toast } from "react-toastify";

export default function OrderTimeSelector({ onClose, onChange }: { onClose: () => void, onChange: (sampleTakenDateTime: { start: Date, end: Date }) => void }) {
    const now = new Date();
    const minTime = now.getHours() >= 18 ? new Date(now.setDate(now.getDate() + 1)).setHours(6, 0, 0, 0) : new Date(now.setHours(Math.max(now.getHours() + 1, 6), 0, 0, 0));

    const [sampleStartTime, setSampleStartTime] = useState<Date>(new Date(minTime));
    const [sampleEndTime, setSampleEndTime] = useState<Date>(new Date(minTime));


    return (
        <Model heading='Schedule Order Times' onClose={onClose}>
            <div className='px-7 py-4 pt-6 pb-5 min-w-80 text-sm'>
                <div className='font-medium text-base mb-2'>Sample Taken</div>
                <DateInput label='Start Date' minTime={new Date(minTime)} maxTime={new Date(new Date().setHours(18, 0, 0))} value={sampleStartTime} onChange={setSampleStartTime} labelClass='font-medium' containerClass='flex-1 mb-2' error={''} />
                <DateInput label='End Date' minTime={new Date(Math.max(new Date().setHours(6, 0, 0, 0), sampleStartTime.getTime()))} maxTime={new Date(new Date().setHours(18, 0, 0, 0))} value={sampleStartTime > sampleEndTime ? sampleStartTime : sampleEndTime} onChange={setSampleEndTime} labelClass='font-medium' containerClass='flex-1' error={''} />
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
        </Model >
    );
}