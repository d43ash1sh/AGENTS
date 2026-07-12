'use client'

import dynamic from 'next/dynamic'


// Import MapComponent dynamically to bypass SSR window undefined errors
const LazyMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] flex flex-col items-center justify-center bg-[#050505] border border-white/8 rounded-xl text-white/30 font-mono text-[10px] uppercase tracking-wider gap-2">
      <svg className="animate-spin h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span>Deploying Google Vector Canvas...</span>
    </div>
  ),
})

import { ComponentProps } from 'react'
import MapComponent from './MapComponent'

export default function MapLoader(props: ComponentProps<typeof MapComponent>) {
  return <LazyMap {...props} />
}
