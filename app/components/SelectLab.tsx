import fetcher from "@/lib/fetcher";
import React, { useEffect, useState } from "react";

interface SelectInstituteProps {
    onSelect: (value: Lab) => void;
    placeholder?: string;
    className?: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    optionElement?: (option: Lab, index: number) => React.JSX.Element
}

type Lab = {
    name: string;
    _id: string;
    sampleType: string;
}

const SelectLab: React.FC<SelectInstituteProps> = ({
    onSelect = () => { },
    placeholder = 'Select Lab',
    className = '',
    inputRef,
    optionElement
}) => {
    const [open, setOpen] = useState(false);
    const [labs, setLabs] = useState<Lab[]>([]);
    const [labSearch, setLabSearch] = useState<string>('');

    async function onSeach(name: string) {
        const res = await fetcher.get<{ labs: Lab[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/labs?filter=${JSON.stringify({ name: name })}&limit=5&page=1`);
        if (res.status === 200 && res.body) {
            setLabs(res.body.labs)
        }
    }

    useEffect(() => {
        onSeach('');
    }, [])

    return (
        <div className="relative">
            <input
                className={"px-3 py-2 border-orange-200 border-2 rounded outline-none w-full " + className}
                type="text"
                value={labSearch}
                placeholder={placeholder}
                onClick={() => setOpen(true)}
                // onBlur={() => setTimeout(() => setOpen(false), 100)}
                onChange={async e => {
                    setLabSearch(e.target.value);
                    onSeach(e.target.value)
                }}
                ref={inputRef} />
            {
                open && labs.length > 0 && <div className="absolute top-12 left-0 w-full bg-white border-2 rounded-md cursor-pointer drop-shadow-lg">
                    <div className=" max-h-[150px] overflow-y-auto">
                        {!optionElement && labs.map(e => (
                            <div
                                key={e.name}
                                className="px-3 py-2 border-b-2 hover:bg-gray-100"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    onSelect(e)
                                    setLabSearch(e.name)
                                    setOpen(false)
                                }}>
                                <div className="turncate">
                                    {e.name}
                                </div>
                                {/* <div className="text-xs text-gray-500 truncate">
                                {e.address}
                            </div> */}
                            </div>
                        ))}
                        {optionElement && labs.map((option, index) => optionElement(option, index))}
                    </div>
                </div>
            }
        </div>
    )
}

export default SelectLab;