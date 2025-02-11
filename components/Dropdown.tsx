import React, { useState } from 'react'
import dropdownArrow from '@/assets/dropdown-arrow.svg'
import Image from 'next/image'
type Props = {
    options: string[] | number[],
    value: string | number,
    onChange?: (value: string | number) => void,
    width?: string | number,
    height?: number,
    showPopupAtTop?: boolean,
    containerClassName?: string,
    optionElement?: (option: string | number, index: number) => React.JSX.Element
}

function Dropdown({ options = [], value = "", onChange = () => { }, containerClassName = '', width, height, showPopupAtTop = false, optionElement }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={'relative ' + containerClassName} style={{ width: width || 'fit-content' }}>
            <div className='flex justify-between items-center border-2 p-2 rounded cursor-pointer gap-1' onClick={() => setIsOpen(!isOpen)} style={{ height: height || 40, width: width || 'fit-content' }}>
                <div>{value}</div>
                <Image src={dropdownArrow} alt='Search Icon' width={16} height={16} className={`transition-all w-4 h-4 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
            {isOpen && <div className='border-2 absolute w-full bg-white z-10 my-1 rounded max-h-60 overflow-y-auto' style={{ top: showPopupAtTop ? 'auto' : '100%', bottom: showPopupAtTop ? '100%' : 'auto' }}>
                {!optionElement && options.map((option, index) => (
                    <div
                        key={index}
                        className='p-2 hover:bg-gray-200 cursor-pointer'
                        onClick={() => {
                            onChange(option);
                            setIsOpen(false)
                        }}>
                        {option}
                    </div>))}
                {optionElement && options.map((option, index) => optionElement(option, index))}
            </div>}
        </div>
    )
}

export default Dropdown