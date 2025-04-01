import React from 'react'

export function NotificationIcon({ size = 24 }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 256 256"
        >
            <g strokeWidth={0} strokeMiterlimit={10} fill="currentColor">
                <path
                    d="M73.844 53.014v-24.17C73.844 12.914 60.93 0 45 0 29.07 0 16.156 12.914 16.156 28.844v24.17c0 3.061-1.34 5.969-3.668 7.957a10.463 10.463 0 00-3.668 7.957 3.33 3.33 0 003.329 3.329h65.7a3.33 3.33 0 003.329-3.329c0-3.061-1.34-5.969-3.668-7.957a10.47 10.47 0 01-3.666-7.957zM57.733 77.181c0 .028.004.054.004.082C57.737 84.297 52.035 90 45 90s-12.737-5.703-12.737-12.737c0-.028.004-.054.004-.082h25.466z"
                    transform="matrix(2.81 0 0 2.81 1.407 1.407)"
                />
            </g>
        </svg>
    )
}