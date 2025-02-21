import fetcher from "@/lib/fetcher";
import React, { useEffect, useState } from "react";

interface SelectInstituteProps {
    onSelect: (value: User) => void;
    placeholder?: string;
    className?: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    optionElement?: (option: User, index: number) => React.JSX.Element
}

type User = {
    name: string;
    _id: string;
    email: string;
}

const SelectUser: React.FC<SelectInstituteProps> = ({
    onSelect = () => { },
    placeholder = 'Select User',
    className = '',
    inputRef,
    optionElement
}) => {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [userSearch, setUserSearch] = useState<string>('');

    async function onSeach(name: string) {
        const res = await fetcher.get<{ users: User[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/admin/users?filter=${JSON.stringify({ email: name })}&limit=5&page=1`);
        if (res.status === 200 && res.body) {
            setUsers(res.body.users)
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
                value={userSearch}
                placeholder={placeholder}
                onClick={() => setOpen(true)}
                // onBlur={() => setTimeout(() => setOpen(false), 100)}
                onChange={async e => {
                    setUserSearch(e.target.value);
                    onSeach(e.target.value)
                }}
                ref={inputRef} />
            {
                open && users.length > 0 && <div className="absolute top-12 left-0 z-10 w-full bg-white border-2 rounded-md cursor-pointer drop-shadow-lg">
                    <div className=" max-h-[150px] overflow-y-auto">
                        {!optionElement && users.map(e => (
                            <div
                                key={e.name}
                                className="px-3 py-2 border-b-2 hover:bg-gray-100"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    setUserSearch(e.name)
                                    setOpen(false)
                                    onSelect(e)
                                }}>
                                <div className="turncate">
                                    {e.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {e.email}
                                </div>
                            </div>
                        ))}
                        {optionElement && users.map((option, index) => optionElement(option, index))}
                    </div>
                </div>
            }
        </div>
    )
}

export default SelectUser;