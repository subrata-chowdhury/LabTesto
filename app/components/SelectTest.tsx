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
    labsDetails?: {
        [key: string]: {
            name: string;
            lab: string;
            price: number;
            offer?: number;
            expenses?: number;
            resultTime: string;
            packages?: string[];
            ranges?: Map<string, string>;
        }
    };
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
    const [loading, setLoading] = useState(false);

    const onSeach = useCallback(debounce(async (name: string) => {
        setLoading(true);
        const res = await fetcher.get<{ tests: Test[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/tests?filter=${JSON.stringify({ name: name })}&limit=5&page=1`);
        if (res.status === 200 && res.body) {
            setTests(res.body.tests)
        }
        setLoading(false);
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
                open && <>
                    <div className="fixed top-0 left-0 w-screen h-screen" onClick={() => setOpen(false)}></div>
                    <div className="absolute top-12 -left-4 w-[calc(100%+60px)] bg-white dark:bg-[#172A46] border-2 dark:border-[#172A46] rounded-md cursor-pointer drop-shadow-lg">
                        <div className="max-h-[150px] overflow-y-auto">
                            {!loading && !optionElement && tests.map(e => (
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
                            {!loading && optionElement && tests.map((option, index) => optionElement(option, index, () => {
                                setTestSearch(option.name)
                                setOpen(false)
                                onSelect(option)
                            }))}
                            {
                                (!loading && !tests.length && testSearch !== '') && <div className="px-3 py-2 text-red-400 font-semibold">
                                    No Test Found
                                </div>
                            }
                            {
                                loading && <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-6 w-6 my-2 border-4 border-b-transparent border-primary dark:border-gray-300 dark:border-b-transparent"></div>
                                </div>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default SelectTest;