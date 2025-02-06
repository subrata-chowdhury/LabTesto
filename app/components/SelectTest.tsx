import { useState } from "react";

interface SelectInstituteProps {
    options: Test[];
    onChange: (value: string) => void;
    onSelect: (value: Test) => void;
    placeholder?: string;
    value: string
}

type Test = {
    name: string;
    _id: string;
}

const SelectTest: React.FC<SelectInstituteProps> = ({
    options = [],
    onChange = () => { },
    onSelect = () => { },
    placeholder = 'Select Institute',
    value = ''
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <input
                className={"px-3 py-2 border-2 rounded outline-none w-full"}
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={e => {
                    onChange(e.target.value)
                    if (e.target.value !== '') setOpen(true)
                    else setOpen(false)
                }} />
            {
                open && <div className="absolute top-12 left-0 w-full bg-white border-2 rounded-md cursor-pointer drop-shadow-lg">
                    <div className=" max-h-[150px] overflow-y-auto">
                        {options.map(e => <div key={e.name} className="px-3 py-2 border-b-2 hover:bg-gray-100" onClick={() => {
                            onSelect(e)
                            onChange(e.name)
                            setOpen(false)
                        }}>
                            <div className="turncate">
                                {e.name}
                            </div>
                            {/* <div className="text-xs text-gray-500 truncate">
                                {e.address}
                            </div> */}
                        </div>)}
                    </div>
                </div>
            }
        </div>
    )
}

export default SelectTest;