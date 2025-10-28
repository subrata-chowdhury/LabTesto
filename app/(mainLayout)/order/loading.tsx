import React from 'react'

const OrdersLoading = () => {
    return (
        <div className="flex-1 flex flex-col p-4 bg-gray-100 dark:bg-white/0 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Ordered Items</h1>
            <div className='flex flex-wrap justify-center sm:justify-normal gap-2 mb-4 mt-3 opacity-80 animate-pulse'>
                {['All', 'Ordered', 'Out for Sample Collection', 'Sample Collected', 'Report Delivered to Lab', 'Report Generated', 'Out for Report Delivery', 'Report Delivered', 'Canceled'].map((e, index) => (
                    <button
                        key={index}
                        className={`px-3.5 py-1.5 rounded-lg cursor-pointer text-sm font-semibold bg-primary/15 dark:bg-white/10 text-transparent`}
                    >
                        {e}
                    </button>
                ))}
            </div>
            <div className="space-y-3 flex-1 overflow-y-scroll">
                {Array(5).fill(0).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-black rounded drop-shadow-md cursor-pointer p-3 px-4">
                        <div className="text-lg w-48 h-7 mb-1 animate-pulse bg-white/20 rounded font-semibold"></div>
                        <div className='text w-60 h-5 animate-pulse bg-white/15 rounded'></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OrdersLoading;