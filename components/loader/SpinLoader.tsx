import React from 'react'

const SpinLoader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-b-transparent border-blue-500"></div>
        </div>
    )
}

export default SpinLoader