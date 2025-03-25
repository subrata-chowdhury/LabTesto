'use client'
import debounce from "@/lib/debouncer";
import fetcher from "@/lib/fetcher";
import React, { useCallback, useEffect, useState } from "react";

interface SelectInstituteProps {
    onSelect: (value: Test) => void;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    optionElement?: (option: Test, index: number, onClick: () => void) => React.JSX.Element
}

type Test = {
    name: string;
    _id: string;
    sampleType: string;
}

const SelectTest: React.FC<SelectInstituteProps> = ({
    onSelect = () => { },
    placeholder = 'Select Test',
    className = '',
    style = {},
    inputRef,
    optionElement
}) => {
    const [open, setOpen] = useState(false);
    const [tests, setTests] = useState<Test[]>([]);
    const [testSearch, setTestSearch] = useState<string>('');

    const onSeach = useCallback(debounce(async (name: string) => {
        const res = await fetcher.get<{ tests: Test[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/tests?filter=${JSON.stringify({ name: name })}&limit=5&page=1`);
        if (res.status === 200 && res.body) {
            setTests(res.body.tests)
        }
    }, 300), []);

    useEffect(() => {
        onSeach('');
    }, [])

    return (
        <div className="relative flex-1">
            <input
                className={"px-3 py-2 bg-transparent border-[#539aca70] border-2 rounded outline-none w-full " + className}
                style={style}
                type="text"
                value={testSearch}
                placeholder={placeholder}
                onClick={() => setOpen(true)}
                // onBlur={() => setTimeout(() => setOpen(false), 100)}
                onChange={async e => {
                    setTestSearch(e.target.value);
                    onSeach(e.target.value)
                }}
                ref={inputRef} />
            {
                open && tests.length > 0 && <div className="absolute top-12 left-0 w-full bg-white border-2 dark:border-[#172A46] rounded-md cursor-pointer drop-shadow-lg">
                    <div className=" max-h-[150px] overflow-y-auto">
                        {!optionElement && tests.map(e => (
                            <div
                                key={e._id}
                                className="px-3 py-2 border-b-2 hover:bg-gray-100"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    setTestSearch(e.name)
                                    setOpen(false)
                                    onSelect(e)
                                }}>
                                <div className="turncate">
                                    {e.name}
                                </div>
                                {/* <div className="text-xs text-gray-500 truncate">
                                {e.address}
                            </div> */}
                            </div>
                        ))}
                        {optionElement && tests.map((option, index) => optionElement(option, index, () => {
                            setTestSearch(option.name)
                            setOpen(false)
                            onSelect(option)
                        }))}
                    </div>
                </div>
            }
        </div>
    )
}

export default SelectTest;