import Link from "next/link";
import { Order } from "../page";
import fetcher from "@/lib/fetcher";
import { toast } from "react-toastify";

export const OrderDetailsCard = ({ order, onPass }: { order: Order, onPass: (order: Order) => void }) => {
    return (
        <div key={order._id} className='flex justify-between items-center flex-col sm:flex-row gap-2 rounded-md border-2 dark:border-gray-600 bg-white dark:bg-[#172A46] dark:shadow-md dark:shadow-black p-2 px-3'>
            {/* <div>{order._id}</div> */}
            <div className='text-xs flex flex-col font-medium text-gray-600'>
                <div className='dark:text-gray-400'>Order from <span className="text-black font-semibold dark:text-gray-200">{order.user.name}</span></div>
                <div className={`text-sm text-gray-800 dark:text-gray-200 ${getColorBasedOnDateTime(new Date(order.sampleTakenDateTime?.start || ''))}`}>{new Date(order.sampleTakenDateTime?.start || '').toDateString()}, {new Date(order?.sampleTakenDateTime?.start || '').toTimeString().split(' ')[0]}</div>
            </div>
            <div className='flex gap-2'>
                <Link className='px-2.5 py-1 bg-primary text-white rounded text-sm font-medium' href={('/collector/orders/view/' + order._id)}>View</Link>
                <Link className='px-2.5 py-1 bg-primary text-white rounded text-sm font-medium' href={('/collector/orders/edit/' + order._id)}>Edit</Link>
                {order.status === 'Ordered' && <button
                    className='px-2.5 py-1 bg-orange-500 text-white rounded text-sm font-medium'
                    onClick={async () => {
                        const res = await fetcher.put<{ id: string }, Order>(`/collector/orders/${order._id}`, { id: order._id });
                        if (res.body && res.status === 200) {
                            onPass(order);
                            toast.success('Order Passed to another collector');
                        } else {
                            toast.error(res.error || 'Unable to Pass the order')
                        }
                    }}>Pass</button>}
            </div>
            {/* <h3>{order.sampleTakenDateTime.date.start}</h3> */}
        </div>
    )
}

function getColorBasedOnDateTime(date: Date) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    if (date < startOfDay) return 'text-red-500';
    if (date >= startOfDay && date <= endOfDay) {
        const currentTime = new Date();
        if (date < currentTime) return 'text-yellow-500'; // Light color for passed time
        return 'text-gray-400'; // Yellow for upcoming time today
    }
    return 'text-green-600';
}