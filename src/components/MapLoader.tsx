'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Import MapComponent dynamically to bypass SSR window undefined errors
const LazyMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] flex flex-col items-center justify-center bg-zinc-900/60 border border-zinc-800 rounded-2xl text-zinc-500">
      <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
      <span className="text-sm">Loading interactive map...</span>
    </div>
  ),
})

import { ComponentProps } from 'react'
import MapComponent from './MapComponent'

export default function MapLoader(props: ComponentProps<typeof MapComponent>) {
  return <LazyMap {...props} />
}
