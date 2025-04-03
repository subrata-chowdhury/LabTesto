import React from 'react'

export default function UserIcon({ size = 20, className = '', onClick = () => { } }: { size?: number; className?: string, onClick?: () => void }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            className={className}
            onClick={onClick}
            viewBox="0 0 256 256"
        >
            <g
                transform="matrix(2.81 0 0 2.81 1.407 1.407)"
                strokeWidth={0}
                strokeMiterlimit={10}
                fill="currentColor"
            >
                <path d="M85.347 90c0-22.283-18.064-40.347-40.347-40.347S4.653 67.717 4.653 90h80.694z" />
                <circle cx={45.003} cy={21.413} r={21.413} />
            </g>
        </svg>
    )
}