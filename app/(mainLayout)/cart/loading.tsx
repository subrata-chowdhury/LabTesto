import React from 'react'

const Loading = () => {
    return (
        <div className='flex-1 flex flex-col p-4 bg-gray-100 dark:bg-white/0 min-h-screen'>
            <AddressLoader />
            <CartLoader />
        </div>
    )
}

export function AddressLoader() {
    return (
        <div className='mb-5 w-full flex justify-between items-center py-3 px-4 min-h-16 rounded bg-white dark:bg-black'>
            <div>
                <div className='w-52 h-6 rounded bg-gray-300 animate-pulse mb-1'></div>
                <div className='w-32 h-5 rounded bg-gray-300 animate-pulse'></div>
            </div>
            <div className='w-24 h-9 ml-2 rounded bg-primary animate-pulse'></div>
        </div>
    )
}

export function CartLoader() {
    return (
        <ul className="space-y-4 flex-1 max-h-[70vh] overflow-y-scroll pb-5">
            {Array(3).fill(0).map((_, index) => (
                <li key={index} className="bg-white dark:bg-black rounded shadow-md flex flex-col">
                    <div className='p-4 flex justify-between items-center'>
                        <div className='flex flex-col gap-4 justify-between h-full'>
                            <div>
                                <div className="text-2xl w-24 h-8 animate-pulse bg-gray-300 font-semibold mb-1.5 rounded"></div>
                                <div className='text-sm w-40 h-5 animate-pulse bg-gray-300 rounded'></div>
                            </div>
                            <div className='mt-auto font-medium text-xl w-40 h-7 animate-pulse bg-gray-300 rounded'></div>
                        </div>
                        <div className='flex flex-col gap-2 text-sm'>
                            <div className='flex gap-2 justify-center items-center animate-pulse'>
                                <div className='text-lg py-1 px-1 w-6 h-6 rounded-md cursor-pointer bg-gray-100 border-2'>
                                    {/* <Minus size={18} fill='black' /> */}
                                </div>
                                <div className='flex-1'></div>
                                {/* <input type='text' min={1} value={item.quantity} className='w-12 text-center' onChange={async (e) => {
                                            let number = Number(e.target.value.trim());
                                            if (number < 1) number = 1;
                                            if (number > 50) number = 50;
                                            await changeQuantity(item.product.test._id, item.product.lab._id, number);
                                        }} /> */}
                                <div className='text-lg py-1 px-1 w-6 h-6 rounded-md cursor-pointer hover:bg-gray-100 border-2'>
                                    {/* <Plus size={18} fill='black' /> */}
                                </div>
                            </div>
                            <div className="border-primary border-2 text-primary px-2 py-1 w-20 h-7 animate-pulse rounded"></div>
                            <div className="bg-primary text-white px-2 py-1 w-20 h-7 animate-pulse rounded"></div>
                        </div>
                    </div>
                    <div className='bg-primary/5 dark:bg-white/5 p-1 text-xs'>
                        {
                            Array(3).fill(0).map((_, i) => (
                                <div className='w-12 h-6 inline-flex mr-2 m-1 mb-0 bg-primary text-white dark:bg-white/20 animate-pulse rounded-full' key={i}>
                                </div>
                            ))
                        }
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default Loading