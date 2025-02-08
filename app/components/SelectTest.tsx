import fetcher from "@/lib/fetcher";
import { useState } from "react";

interface SelectInstituteProps {
    onSelect: (value: Test) => void;
    placeholder?: string;
    className?: string;
}

type Test = {
    name: string;
    _id: string;
}

const SelectTest: React.FC<SelectInstituteProps> = ({
    onSelect = () => { },
    placeholder = 'Select Test',
    className = ''
}) => {
    const [open, setOpen] = useState(false);
    const [tests, setTests] = useState<{ name: string, _id: string }[]>([]);
    const [testSearch, setTestSearch] = useState<string>('');

    return (
        <div className="relative">
            <input
                className={"px-3 py-2 border-2 rounded outline-none w-full " + className}
                type="text"
                value={testSearch}
                placeholder={placeholder}
                onChange={async e => {
                    setTestSearch(e.target.value)
                    const res = await fetcher.get<{ tests: { name: string, _id: string }[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/tests?filter=${JSON.stringify({ name: e.target.value })}&limit=5&page=1`);
                    if (res.status === 200 && res.body) {
                        setTests(res.body.tests)
                        if (res.body.tests.length > 0) setOpen(true)
                    }
                }} />
            {
                open && tests.length > 0 && <div className="absolute top-12 left-0 w-full bg-white border-2 rounded-md cursor-pointer drop-shadow-lg">
                    <div className=" max-h-[150px] overflow-y-auto">
                        {tests.map(e => <div key={e.name} className="px-3 py-2 border-b-2 hover:bg-gray-100" onClick={() => {
                            onSelect(e)
                            setTestSearch(e.name)
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