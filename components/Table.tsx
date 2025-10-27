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
    loading?: boolean
}

function Table<T>({ name, table, pagination, limit, onSearch, tag, dropdown, loading = false }: Props<T>) {
    return (
        <div className='border-2 border-gray-300/50 rounded-md dark:border-gray-500 bg-white dark:bg-[#172A46]'>
            <h3 className='p-3 border-b-2 border-gray-300/50 dark:border-gray-500 text-xl font-semibold'>{name}</h3>
            <div className='p-3 flex justify-between items-center md:flex-row flex-col gap-2'>
                <TableTags loading={loading} tags={tag?.tags || []} onActiveTagChange={tag?.onTagChange} />
                <div className='flex gap-2 items-center'>
                    {onSearch && <SearchBar onSearch={val => !loading ? onSearch(val) : ''} />}
                    {dropdown && <Dropdown
                        loading={loading}
                        options={dropdown?.options || []}
                        value={dropdown?.value || ''}
                        onChange={val => dropdown?.onChange(val.value)}
                        width={dropdown?.width}
                        height={dropdown?.height} />}
                </div>
            </div>
            <MainTable<T> loading={loading} {...table} />
            <div className='flex flex-col gap-2 md:flex-row md:gap-0 justify-between items-center p-4'>
                <div className='flex gap-2 items-center'>
                    <p className='text-sm text-gray-600 dark:text-gray-400 '>Showing</p>
                    <Dropdown loading={loading} options={limit.options || [5, 10, 15]} value={limit.limit} onChange={(val) => limit.onLimitChange(val.value)} showPopupAtTop={true} height={38} />
                    <p className='text-sm text-gray-600 dark:text-gray-400  text-nowrap'>Out of {pagination.totalPages}</p>
                </div>
                <Pagination loading={loading} currentPage={pagination.currentPage} totalPages={pagination.totalPages} onChange={pagination.onPageChange} />
            </div>
        </div>
    )
}

export default Table


interface MainTableProps<T> {
    config: { heading: string, selector?: keyof T, hideAble?: boolean, component?: React.FC<{ data: T, index: number }> }[],
    data: T[],
    className?: string,
    loading?: boolean
}

export function MainTable<T>({
    config = [],
    data = [],
    className = '',
    loading = false
}: MainTableProps<T>) {
    if (!config.length) return <div>Invalid Data</div>
    return (
        <table className={'text-start overflow-hidden border-y-2 border-gray-300/50 w-full ' + className} cellPadding={0} cellSpacing={0}>
            <thead>
                <tr style={{ height: 48 }} className='bg-gray-200  dark:bg-gray-500'>
                    {config.map((configObj, index) => (
                        <th key={index} className={`text-start pl-4 font-normal min-h-12 items-center ${configObj.hideAble ? "hidden md:flex" : ""}`}>{configObj.heading}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {!loading && data?.length > 0 && data.map((obj, index) => (
                    <tr key={index} className='border-t border-gray-300/50' style={{ height: 48 }}>
                        {config.map((configObj, innerIndex) => (
                            // @ts-expect-error: Type 'keyof T' cannot be used as an index type.
                            <td key={innerIndex} className={`pl-4 min-h-12 items-center ${configObj.hideAble ? "hidden md:flex" : ""}`} >{configObj.component ? React.createElement(configObj.component, { data: obj, index }) : obj[configObj.selector || ""]}</td>
                        ))}
                    </tr>
                ))}
                {loading && <tr><td className='text-center h-12 text-red-500 font-medium' colSpan={config.length}>
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-gray-900 dark:border-gray-300 dark:border-b-transparent"></div>
                    </div>
                </td></tr>}
                {!loading && (!data || data?.length <= 0) && <tr><td className='text-center h-12 text-red-500 font-medium' colSpan={config.length}>No Data Found</td></tr>}
            </tbody>
        </table>
    )
}

function TableTags({ tags = [], onActiveTagChange = () => { }, loading = false }: { tags: string[], onActiveTagChange?: (tag: string) => void, loading?: boolean }) {
    const [activeTag, setActiveTag] = useState(tags[0]);

    return (
        <div className='inline-flex gap-2'>
            {tags.map((tag, index) => (
                <div
                    key={index}
                    className={`cursor-pointer p-2 px-4 rounded border-2 ${activeTag === tag ? 'border-blue-300 dark:border-blue-500 text-blue-500 bg-primary/10' : 'bg-white dark:bg-[#172A46] border-gray-300/50 dark:border-gray-400'}`}
                    onClick={() => {
                        if (loading) return
                        setActiveTag(tag);
                        onActiveTagChange(tag);
                    }}>{tag}</div>
            ))}
        </div>
    )
}

function SearchBar({ onSearch = () => { } }: { onSearch?: (value: string) => void }) {
    const [searchValue, setSearchValue] = useState('');

    return (
        <div className='flex items-center gap-1 p-1 px-2 rounded border-2 border-gray-300/50 dark:border-gray-500 max-w-52 min-h-10'>
            <Image src={SearchIcon} alt='' className='w-5 h-5' width={20} height={20} />
            <input className='outline-none w-full bg-transparent text-sm' value={searchValue} placeholder='Search' onChange={e => { setSearchValue(e.target.value); onSearch(e.target.value) }} />
        </div>
    )
}