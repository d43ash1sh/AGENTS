import React from 'react'

interface LogoProps {
  className?: string
  iconSize?: number
  showText?: boolean
}

export default function Logo({ className = '', iconSize = 16, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-black"
        aria-hidden="true"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      {showText && (
        <span className="font-bold text-[14px] tracking-[-0.02em] font-sans text-black">
          NestRGU
        </span>
      )}
    </div>
  )
}
