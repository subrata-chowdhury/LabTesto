import Image from 'next/image'
import React, { useState } from 'react'
import eye from "@/assets/eye.svg";
import eyeClosed from "@/assets/eye-off.svg";

type Props = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    name?: string;
    error?: string;
    iconSize?: number;
    labelClass?: string;
}

const PasswordInput = ({ label = "", value = "", placeholder = "", name = "", onChange = () => { }, error = "", iconSize = 24, labelClass = "" }: Props) => {
    const [isPassword, setIsPassword] = useState(true);

    return (
        <label className="flex flex-col gap-1">
            <p className={labelClass}>{label}</p>
            <div className="flex">
                <input type={isPassword ? "password" : 'text'} placeholder={placeholder} name={name} value={value} onChange={e => onChange(e.target.value)} className="px-3 py-2 border-2 dark:border-gray-400 rounded-l outline-none flex-1 bg-transparent" />
                <div className="px-3 py-2 cursor-pointer flex justify-center items-center border-2 dark:border-gray-400 border-l-0 rounded-r" onClick={() => setIsPassword(prevVal => !prevVal)}>
                    <Image width={iconSize} height={iconSize} src={isPassword ? eye : eyeClosed} alt="" />
                </div>
            </div>
            {(error && error.length > 0) && <p className="text-red-500 text-xs font-medium">{error}</p>}
        </label>
    )
}

export default PasswordInput