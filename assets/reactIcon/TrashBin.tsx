import React from 'react'

export default function TrashBinIcon({ size = 20 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 25" fill="none">
            <path d="M3 6.21582H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 6.21582V20.2158C19 21.2158 18 22.2158 17 22.2158H7C6 22.2158 5 21.2158 5 20.2158V6.21582" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 6.21582V4.21582C8 3.21582 9 2.21582 10 2.21582H14C15 2.21582 16 3.21582 16 4.21582V6.21582" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11.2158V17.2158" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 11.2158V17.2158" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
