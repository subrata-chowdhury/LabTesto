import React from 'react'

const OrdersLoading = () => {
    return (
        <div className="flex-1 flex flex-col p-4 bg-gray-100 dark:bg-[#0A192F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Ordered Items</h1>
            <div className="space-y-3 flex-1 overflow-y-scroll">
                {Array(5).fill(0).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-[#172A46] rounded drop-shadow-md cursor-pointer p-3 px-4">
                        <div className="text-lg w-48 h-7 mb-1 animate-pulse bg-gray-300 rounded font-semibold"></div>
                        <div className='text w-60 h-5 animate-pulse bg-gray-300 rounded'></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OrdersLoading;