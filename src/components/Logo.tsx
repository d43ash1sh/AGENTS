import React from 'react'

interface LogoProps {
  className?: string
  iconSize?: number
  showText?: boolean
}

export default function Logo({ className = '', iconSize = 32, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logoPinGradComponent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#6366f1" />
          </linearGradient>
        </defs>
        
        {/* Outer Location Pin */}
        <path
          d="M16 2C10.5 2 6 6.5 6 12C6 19.5 16 30 16 30S26 19.5 26 12C26 6.5 21.5 2 16 2Z"
          fill="url(#logoPinGradComponent)"
        />
        
        {/* Contrast Background Circle */}
        <circle cx="16" cy="12" r="6" fill="#09090b" />
        
        {/* Graduation Cap / House Roof */}
        <path d="M16 8L20.5 10.5L16 13L11.5 10.5Z" fill="#3b82f6" />
        
        {/* Tassel */}
        <path d="M16 10.5L19 12V14.5" stroke="#60a5fa" stroke-width="1" stroke-linecap="round" />
        
        {/* House Walls */}
        <path
          d="M13 12.5V15.5H19V12.5"
          stroke="#ffffff"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        
        {/* House Door */}
        <path d="M15 15.5V14H17V15.5" fill="#60a5fa" />
      </svg>
      {showText && (
        <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          RoomNearRGU
        </span>
      )}
    </div>
  )
}
