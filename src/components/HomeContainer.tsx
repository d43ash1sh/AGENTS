'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Listing } from '@/lib/services/listings'
import ListingCard from './ListingCard'
import MapLoader from './MapLoader'
import { Search, SlidersHorizontal, Map, List, RefreshCw, ChevronDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface HomeContainerProps {
  initialListings: Listing[]
}

function Counter({ end, suffix = '', duration = 1.5 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      const currentVal = Math.floor(progress * end)
      setCount(currentVal)
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step)
      }
    }

    animationFrameId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(animationFrameId)
  }, [end, duration])

  return <span>{count}{suffix}</span>
}

const firstLineWords = "Find room near RGU.".split(" ")
const secondLineWords = "Skip broker drama.".split(" ")

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const staggerWordVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
    }
  }
}

export default function HomeContainer({ initialListings }: HomeContainerProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list')
  const [showFilters, setShowFilters] = useState(false)
  const roomsSectionRef = useRef<HTMLDivElement>(null)

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [roomType, setRoomType] = useState<string>('all')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [maxDistance, setMaxDistance] = useState<number>(5)
  const [status, setStatus] = useState<string>('available')

  const handleResetFilters = () => {
    setSearchQuery('')
    setRoomType('all')
    setMaxPrice('')
    setMaxDistance(5)
    setStatus('available')
  }

  // Filter listings
  const filteredListings = useMemo(() => {
    return initialListings.filter((room) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = room.title?.toLowerCase().includes(q)
        const matchDesc = room.description?.toLowerCase().includes(q)
        const matchAddress = room.address?.toLowerCase().includes(q)
        if (!matchTitle && !matchDesc && matchAddress === false) return false
      }
      if (roomType !== 'all' && room.room_type !== roomType) return false
      if (maxPrice.trim()) {
        const limit = parseFloat(maxPrice)
        if (!isNaN(limit) && room.price > limit) return false
      }
      if (room.distance_to_rgu > maxDistance) return false
      if (status !== 'all' && room.status !== status) return false
      return true
    })
  }, [initialListings, searchQuery, roomType, maxPrice, maxDistance, status])

  const scrollToRooms = () => {
    roomsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col flex-1 bg-[#ffffff] text-[#000000] min-h-screen relative w-full">
      
      {/* Light visual glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[25%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute top-[45%] right-[15%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      {/* 100vh Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 py-28 text-center z-10 border-b border-black/5">
        <div className="max-w-4xl space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.55, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="caveman-label text-[10px] text-black/50"
          >
            Verified Campus Housing Discovery
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              className="caveman-hero text-5xl sm:text-7xl md:text-8xl tracking-[-0.04em] text-black leading-[0.98] pb-2"
            >
              <span className="block overflow-hidden py-1">
                {firstLineWords.map((word, idx) => (
                  <span key={idx} className="inline-block overflow-hidden mr-3 sm:mr-4">
                    <motion.span variants={staggerWordVariants} className="inline-block">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
              <span className="block overflow-hidden py-1 animated-gradient-text">
                {secondLineWords.map((word, idx) => (
                  <span key={idx} className="inline-block overflow-hidden mr-3 sm:mr-4">
                    <motion.span variants={staggerWordVariants} className="inline-block">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 0.65, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed text-black/80 font-light"
            >
              Verified rooms around Rajiv Gandhi University, Doimukh. Direct communication, clean deals, zero middleman markup.
            </motion.p>
          </div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-wrap justify-center items-center gap-4 pt-4"
          >
            <button
              onClick={scrollToRooms}
              className="flex items-center gap-2 px-6 py-3 text-xs font-mono uppercase tracking-wider text-white bg-black hover:bg-black/90 rounded transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-black/10"
            >
              <span>Find Rooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/listings/new"
              className="flex items-center gap-2 px-6 py-3 text-xs font-mono uppercase tracking-wider text-black bg-black/5 hover:bg-black/10 border border-black/10 rounded transition-all active:scale-[0.98] cursor-pointer"
            >
              List Property
            </Link>
          </motion.div>

          {/* Caveman-style Proof / Verification Grid */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 mx-auto max-w-4xl pt-20 text-center"
          >
            <h2 className="font-semibold leading-[0.98] tracking-[-0.03em] text-black [text-wrap:balance]" style={{ fontSize: 'clamp(2.25rem, 6vw, 3.5rem)' }}>
              The proof is public.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty text-base text-black/45 sm:text-lg font-light leading-relaxed">
              Every listing here is live and verified — direct coordinates, zero broker markup, zero drama.
            </p>

            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-y-9 sm:grid-cols-2 sm:gap-y-0 text-center">
              <a href="#directory" onClick={(e) => { e.preventDefault(); scrollToRooms(); }} className="group block px-6 transition-colors sm:p-9 border-b border-black/5 sm:border-b-0">
                <span className="relative inline-flex items-start whitespace-nowrap text-[2rem] font-semibold leading-none tracking-[-0.04em] text-black tnum sm:text-[2.75rem]">
                  <Counter end={500} suffix="+" />
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right mt-0.5 size-3.5 text-black/30 transition-colors group-hover:text-black/70 sm:mt-1" aria-hidden="true">
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </span>
                <span className="mt-3 block text-pretty text-sm leading-snug text-black/45 font-light">Rooms listed, live</span>
              </a>

              <a href="#directory" onClick={(e) => { e.preventDefault(); scrollToRooms(); }} className="group block px-6 transition-colors sm:p-9 sm:border-l sm:border-black/10 border-b border-black/5 sm:border-b-0">
                <span className="relative inline-flex items-start whitespace-nowrap text-[2rem] font-semibold leading-none tracking-[-0.04em] text-black tnum sm:text-[2.75rem]">
                  <Counter end={150} suffix="+" />
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right mt-0.5 size-3.5 text-black/30 transition-colors group-hover:text-black/70 sm:mt-1" aria-hidden="true">
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </span>
                <span className="mt-3 block text-pretty text-sm leading-snug text-black/45 font-light">Verified property owners</span>
              </a>

              <div className="px-6 sm:p-9 sm:border-t sm:border-black/10 border-b border-black/5 sm:border-b-0 py-6">
                <span className="relative inline-flex items-start whitespace-nowrap text-[2rem] font-semibold leading-none tracking-[-0.04em] text-black tnum sm:text-[2.75rem]">
                  <Counter end={24} suffix="h" />
                </span>
                <span className="mt-3 block text-pretty text-sm leading-snug text-black/45 font-light">Physical verification SLA</span>
              </div>

              <div className="px-6 sm:p-9 sm:border-l sm:border-t sm:border-black/10 py-6">
                <span className="relative inline-flex items-start whitespace-nowrap text-[2rem] font-semibold leading-none tracking-[-0.04em] text-black tnum sm:text-[2.75rem]">
                  &lt; 1.5 km
                </span>
                <span className="mt-3 block text-pretty text-sm leading-snug text-black/45 font-light">Average distance to campus</span>
              </div>
            </div>

            <div className="mt-16">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/30">As seen on</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 font-mono text-xs text-black/40">
                <span className="hover:text-black/80 transition-colors">Rajiv Gandhi University</span>
                <span className="text-black/20">•</span>
                <span className="hover:text-black/80 transition-colors">Doimukh</span>
                <span className="text-black/20">•</span>
                <span className="hover:text-black/80 transition-colors">Rono Hills</span>
                <span className="text-black/20">•</span>
                <span className="hover:text-black/80 transition-colors">Doimukh H.Q.</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-black/20 hover:text-black/40 cursor-pointer transition-colors" onClick={scrollToRooms}>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
      </section>

      {/* Main browse section */}
      <div ref={roomsSectionRef} className="w-full mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16 z-10 flex flex-col gap-8 scroll-mt-14">
        
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="caveman-label text-[9px]">Accommodation Database</span>
            <h2 className="caveman-title text-2xl sm:text-3xl text-black">Available Rooms Directory</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow rounded border border-black/8 bg-black/2 focus-within:border-black/20 transition-colors">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black/30">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by neighborhood, street, room type..."
                className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-black placeholder-black/30 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-3 border rounded font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                showFilters 
                  ? 'border-black/30 bg-black/10 text-black' 
                  : 'border-black/8 bg-black/2 text-black/50 hover:text-black hover:border-black/15'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className="bg-black/2 border border-black/8 p-6 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  <div className="space-y-2">
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-black/45">Room Type</label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full bg-[#ffffff] border border-black/8 text-xs text-black p-2.5 rounded focus:border-black/20 focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Room Types</option>
                      <option value="single">Single Room</option>
                      <option value="shared">Shared Room</option>
                      <option value="apartment">Apartment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-black/45">Max Rent (₹ /mo)</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="e.g. 6000"
                      className="w-full bg-[#ffffff] border border-black/8 text-xs text-black p-2.5 rounded focus:border-black/20 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-black/45">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-[#ffffff] border border-black/8 text-xs text-black p-2.5 rounded focus:border-black/20 focus:outline-none cursor-pointer"
                    >
                      <option value="available">Available Rooms Only</option>
                      <option value="all">All (incl. rented)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-wider text-black/45">
                      <span>Max Distance to RGU</span>
                      <span className="text-black font-bold">{maxDistance} km</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                      className="w-full h-1 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-4 flex justify-end">
                    <button
                      onClick={handleResetFilters}
                      className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-black/40 hover:text-black transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Filters</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex md:hidden border-b border-black/8 bg-[#ffffff]/80 backdrop-blur sticky top-14 z-30 justify-around p-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] uppercase tracking-wider rounded transition-colors cursor-pointer ${
              activeTab === 'list' ? 'bg-black text-white' : 'text-black/40 hover:text-black'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List ({filteredListings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] uppercase tracking-wider rounded transition-colors cursor-pointer ${
              activeTab === 'map' ? 'bg-black text-white' : 'text-black/40 hover:text-black'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
        </div>

        <div className="font-mono text-[9px] uppercase tracking-wider text-black/35">
          Found {filteredListings.length} matching rooms
        </div>

        {/* List & Map Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start min-h-[600px] mt-2">
          
          <div className={`md:col-span-7 flex flex-col gap-6 ${activeTab === 'list' ? 'block' : 'hidden md:block'}`}>

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredListings.map((room) => (
                  <ListingCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center border border-black/5 border-dashed rounded-lg bg-black/1">
                <p className="font-semibold text-black/80">No matches found</p>
                <p className="text-xs text-black/40 mt-1 max-w-xs leading-relaxed">
                  Try adjusting filters or changing your search criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-white bg-black hover:bg-black/90 rounded transition-all cursor-pointer"
                >
                  Clear Search Filters
                </button>
              </div>
            )}
          </div>

          <div
            className={`md:col-span-5 h-[450px] md:h-[calc(100vh-140px)] md:sticky md:top-20 z-20 ${
              activeTab === 'map' ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="w-full h-full">
              <MapLoader listings={filteredListings} />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
