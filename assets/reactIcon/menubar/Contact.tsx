import React from 'react'

export function ContactIcon({ size = 24 }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 256 256"
        >
            <g strokeWidth={0} strokeMiterlimit={10} fill="currentColor">
                <path
                    d="M62.015 90a3.998 3.998 0 01-3.401-1.897l-14.92-24.144a4 4 0 01-.527-2.847l3.336-17.615-17.615 3.335a4.005 4.005 0 01-2.847-.527L1.897 31.387a4 4 0 01.98-7.242l82-23.984a4.002 4.002 0 014.962 4.963l-23.984 82A4 4 0 0162.015 90z"
                    transform="matrix(2.81 0 0 2.81 1.407 1.407)"
                />
                <path
                    d="M6.146 87.854a4 4 0 01-2.829-6.828l28.104-28.104a4 4 0 115.657 5.656L8.975 86.683a3.99 3.99 0 01-2.829 1.171zM26.44 89.699a4 4 0 01-2.829-6.828l10.577-10.577a4 4 0 115.657 5.656L29.269 88.527a3.985 3.985 0 01-2.829 1.172zM4.301 67.56a4 4 0 01-2.829-6.828l10.577-10.577a4 4 0 115.657 5.656L7.129 66.388a3.987 3.987 0 01-2.828 1.172z"
                    transform="matrix(2.81 0 0 2.81 1.407 1.407)"
                />
            </g>
        </svg>
    )
}