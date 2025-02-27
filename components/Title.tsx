import React, { useState } from 'react'

type Props = {
    title: string | React.ReactNode,
    children: React.ReactNode,
    titleClass?: string,
    containerStyle?: React.CSSProperties,
    width?: number,
    onClick?: () => void
}

const Title: React.FC<Props> = ({ title, titleClass = '', containerStyle = {}, onClick = () => { }, children }) => {
    const [showTitle, setShowTitle] = useState(false);

    return (
        <div className='relative flex flex-col items-center'>
            {
                showTitle &&
                <div className={'absolute top-[-8px] -translate-y-full p-2 px-3 rounded-lg text-xs z-10 bg-slate-200 w-fit ' + titleClass}>
                    {title}
                    <div className='absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-slate-200'></div>
                </div>
            }
            <div className='cursor-pointer' onClick={onClick} style={{ ...containerStyle }} onMouseEnter={() => setShowTitle(true)} onMouseLeave={() => setShowTitle(false)}>
                {children}
            </div>
        </div>
    )
}

export default Title