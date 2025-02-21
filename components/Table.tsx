import React, { useState } from 'react'
import Pagination from './Pagination'
import SearchIcon from '@/assets/search.svg'
import Image from 'next/image'
import Dropdown from './Dropdown'

type Props<T> = {
    name: string,
    table: {
        config: { heading: string, selector?: keyof T, hideAble?: boolean, component?: React.FC<{ data: T, index: number }> }[],
        data: T[],
        tableStyle?: React.CSSProperties,
    }
    pagination: {
        currentPage: number,
        totalPages: number,
        onPageChange: (page: number) => void
    },
    limit: {
        options: string[] | number[],
        limit: string | number,
        onLimitChange: (value: string | number) => void,
    }
    onSearch?: (value: string) => void,
    tag?: {
        tags: string[],
        onTagChange: (tag: string) => void
    }
    dropdown?: {
        options: string[] | number[],
        value: string | number,
        onChange: (value: string | number) => void,
        width?: number,
        height?: number,
        // showPopupAtTop?: boolean,
    }
}

function Table<T>({ name, table, pagination, limit, onSearch, tag, dropdown }: Props<T>) {
    return (
        <div className='border-2 rounded-md bg-white'>
            <h3 className='p-3 border-b-2 text-xl font-semibold'>{name}</h3>
            <div className='p-3 flex justify-between items-center md:flex-row flex-col gap-2'>
                <TableTags tags={tag?.tags || []} onActiveTagChange={tag?.onTagChange} />
                <div className='flex gap-2 items-center'>
                    <SearchBar onSearch={onSearch} />
                    {dropdown && <Dropdown
                        options={dropdown?.options || []}
                        value={dropdown?.value || ''}
                        onChange={val => dropdown?.onChange(val.value)}
                        width={dropdown?.width}
                        height={dropdown?.height} />}
                </div>
            </div>
            <MainTable<T> {...table} />
            <div className='flex flex-col gap-2 md:flex-row md:gap-0 justify-between items-center p-4'>
                <div className='flex gap-2 items-center'>
                    <p className='text-sm text-gray-600'>Showing</p>
                    <Dropdown options={limit.options || [5, 10, 15]} value={limit.limit} onChange={(val) => limit.onLimitChange(val.value)} showPopupAtTop={true} height={38} />
                    <p className='text-sm text-gray-600 text-nowrap'>Out of {pagination.totalPages}</p>
                </div>
                <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onChange={pagination.onPageChange} />
            </div>
        </div>
    )
}

export default Table


interface MainTableProps<T> {
    config: { heading: string, selector?: keyof T, hideAble?: boolean, component?: React.FC<{ data: T, index: number }> }[],
    data: T[],
    className?: string,
}

export function MainTable<T>({
    config = [],
    data = [],
    className = ''
}: MainTableProps<T>) {
    if (!config.length) return <div>Invalid Data</div>
    return (
        <table className={'text-start overflow-hidden border-y-2 w-full ' + className} cellPadding={0} cellSpacing={0}>
            <thead>
                <tr style={{ height: 48 }} className='bg-gray-200'>
                    {config.map((configObj, index) => (
                        <th key={index} className={`text-start pl-4 font-normal ${configObj.hideAble ? "hide-able" : ""}`}>{configObj.heading}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data?.length > 0 && data.map((obj, index) => (
                    <tr key={index} className='border-t' style={{ height: 48 }}>
                        {config.map((configObj, innerIndex) => (
                            // @ts-expect-error: Type 'keyof T' cannot be used as an index type.
                            <td key={innerIndex} className={`pl-4 ${configObj.hideAble ? "hide-able" : ""}`} >{configObj.component ? React.createElement(configObj.component, { data: obj, index }) : obj[configObj.selector || ""]}</td>
                        ))}
                    </tr>
                ))}
                {(!data || data?.length <= 0) && <tr><td className='text-center' colSpan={config.length}>No Data Found</td></tr>}
            </tbody>
        </table>
    )
}

function TableTags({ tags = [], onActiveTagChange = () => { } }: { tags: string[], onActiveTagChange?: (tag: string) => void }) {
    const [activeTag, setActiveTag] = useState(tags[0]);

    return (
        <div className='inline-flex gap-2'>
            {tags.map((tag, index) => (
                <div key={index} className={`cursor-pointer p-2 px-4 rounded border-2 ${activeTag === tag ? 'border-blue-300 text-blue-500 bg-blue-50' : 'bg-white'}`} onClick={() => { setActiveTag(tag); onActiveTagChange(tag) }}>{tag}</div>
            ))}
        </div>
    )
}

function SearchBar({ onSearch = () => { } }: { onSearch?: (value: string) => void }) {
    const [searchValue, setSearchValue] = useState('');

    return (
        <div className='flex items-center gap-1 p-1 px-2 rounded border-2 max-w-52 min-h-10'>
            <Image src={SearchIcon} alt='' className='w-5 h-5' width={20} height={20} />
            <input className='outline-none w-full text-sm' value={searchValue} placeholder='Search' onChange={e => { setSearchValue(e.target.value); onSearch(e.target.value) }} />
        </div>
    )
}