'use client'
import React from 'react'

type Props = {
    label: string;
    value: string;
    min?: number;
    max?: number;
    onChange: (val: string) => void;
    name?: string;
    placeholder?: string;
    type?: 'text' | 'number';
    error?: string;
    inputStyle?: React.CSSProperties;
    containerClass?: string;
    labelClass?: string;
    ref?: React.RefObject<HTMLInputElement | null>;
}

const Input = ({ label = "", placeholder = "", name = "", error = "", value = "", min, max, onChange = () => { }, type = 'text', inputStyle = {}, containerClass = "", labelClass = "", ref }: Props) => {
    return (
        <label className={"flex flex-col gap-1 " + containerClass}>
            <div className={labelClass}>{label}</div>
            <input type={type} placeholder={placeholder} min={min} max={max} name={name} value={value} onChange={e => onChange(e.target.value)} className="px-3 py-2 border-2 border-gray-300/60 dark:border-white/20 rounded outline-none bg-transparent" style={inputStyle} ref={ref} />
            {(error && error?.length > 0) && <p className="text-red-500 text-xs font-medium">{error}</p>}
        </label>
    )
}

export default Input