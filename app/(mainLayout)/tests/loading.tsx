import React from 'react'

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-b-transparent border-primary dark:border-white"></div>
        </div>
    )
}

export default Loading