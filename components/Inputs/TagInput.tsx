import Image from 'next/image';
import React, { useRef, useState } from 'react';
import crossIcon from '@/assets/cross.svg'

type Props = {
    label?: string,
    values?: string[],
    className?: string,
    onChange?: (val: string[]) => void,
    error?: string
}

const TagInput = ({ label, values = [], onChange = () => { }, className = '', error = '' }: Props) => {
    const [tag, setTag] = useState<string>('');
    const inputContainer = useRef<HTMLInputElement>(null);

    return (
        <div className={'flex flex-col gap-1 rounded '+ className} onClick={() => inputContainer.current?.focus()}>
            {label && <div className='font-medium'>{label}</div>}
            <div className='gap-2 border-2 border-gray-300/50 rounded px-3 py-2 max-h-44 min-h-20 overflow-y-auto'>
                {values.length > 0 && values.map((tag, index) =>
                    <div key={index} className='bg-gray-200 inline-flex items-center justify-between m-1 px-2 py-1 rounded text-sm'>
                        {tag}
                        <Image
                            src={crossIcon}
                            className='ml-2 cursor-pointer'
                            onClick={() => {
                                const newTags = [...values];
                                newTags.splice(index, 1);
                                onChange(newTags);
                            }}
                            alt=''
                            width={14}
                            height={14} />
                    </div>
                )}
                <input
                    ref={inputContainer}
                    className='outline-none m-2 bg-transparent'
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && tag.trim() !== '') {
                            const newTags = [...values, tag.trim()];
                            setTag('');
                            onChange(newTags);
                        }
                    }}
                />
            </div>
            {error.length > 0 ? <p className="text-red-500 text-xs font-medium">{error}</p> : ''}
        </div>
    )
}

export default TagInput