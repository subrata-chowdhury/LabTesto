import React from 'react'

type Props = {
    label: string;
    value: string;
    onChange: (val: string) => void;
    name?: string;
    placeholder?: string;
    type?: 'text' | 'number';
    error?: string;
    containerClass?: string;
    labelClass?: string;
}

const Input = ({ label = "", placeholder = "", name = "", error = "", value = "", onChange = () => { }, type = 'text', containerClass = "", labelClass = "" }: Props) => {
    return (
        <label className={"flex flex-col gap-1 " + containerClass}>
            <div className={labelClass}>{label}</div>
            <input type={type} placeholder={placeholder} name={name} value={value} onChange={e => onChange(e.target.value)} className="px-3 py-2 border-2 rounded outline-none" />
            {(error && error?.length > 0) && <p className="text-red-500 text-xs font-medium">{error}</p>}
        </label>
    )
}

export default Input