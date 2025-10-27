import React from 'react'

const Loading = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-b-transparent border-blue-500"></div>
        </div>
    )
}

export default Loading