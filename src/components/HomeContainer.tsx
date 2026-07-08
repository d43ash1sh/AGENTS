'use client'

import { useState, useMemo } from 'react'
import { Listing } from '@/lib/services/listings'
import ListingCard from './ListingCard'
import MapLoader from './MapLoader'
import { Search, SlidersHorizontal, Map, List, RefreshCw } from 'lucide-react'

interface HomeContainerProps {
  initialListings: Listing[]
}

export default function HomeContainer({ initialListings }: HomeContainerProps) {
  // Mobile active tab toggle ('list' | 'map')
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list')
  const [showFilters, setShowFilters] = useState(false)

  // Filtering States
  const [searchQuery, setSearchQuery] = useState('')
  const [roomType, setRoomType] = useState<string>('all')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [maxDistance, setMaxDistance] = useState<number>(5) // default max 5km
  const [status, setStatus] = useState<string>('available') // default to showing available only

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearchQuery('')
    setRoomType('all')
    setMaxPrice('')
    setMaxDistance(5)
    setStatus('available')
  }

  // Filter listings in memory
  const filteredListings = useMemo(() => {
    return initialListings.filter((room) => {
      // 1. Text Search query (title, description, address)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = room.title?.toLowerCase().includes(q)
        const matchesDesc = room.description?.toLowerCase().includes(q)
        const matchesAddress = room.address?.toLowerCase().includes(q)
        if (!matchesTitle && !matchesDesc && !matchesAddress) return false
      }

      // 2. Room Type filter
      if (roomType !== 'all' && room.room_type !== roomType) {
        return false
      }

      // 3. Max Price filter
      if (maxPrice.trim()) {
        const priceLimit = parseFloat(maxPrice)
        if (!isNaN(priceLimit) && room.price > priceLimit) {
          return false
        }
      }

      // 4. Max Distance filter
      if (room.distance_to_rgu > maxDistance) {
        return false
      }

      // 5. Status filter
      if (status !== 'all' && room.status !== status) {
        return false
      }

      return true
    })
  }, [initialListings, searchQuery, roomType, maxPrice, maxDistance, status])

  return (
    <div className="flex flex-col flex-1 h-full min-h-[calc(100vh-4rem)] bg-zinc-950 text-white">
      {/* Mobile view toggle header */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-16 z-30 md:hidden justify-around p-2">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'list' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <List className="w-4 h-4" />
          <span>List View ({filteredListings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'map' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>Map View</span>
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden h-full">
        {/* Left Column: Listings and filters (7 cols on desktop, toggled on mobile) */}
        <div
          className={`md:col-span-7 flex flex-col h-full border-r border-zinc-900 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6 ${
            activeTab === 'list' ? 'block' : 'hidden md:block'
          }`}
        >
          {/* Header search bar */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-white">
                Find Student Rooms Near RGU
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Explore verified accommodations within walking or short transit distance of RGU Campus.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-grow rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4.5 w-4.5 text-zinc-500" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-xl border-0 bg-zinc-900 py-3 pl-10 pr-4 text-white ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
                  placeholder="Search by area, road, or room title..."
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                  showFilters 
                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
                aria-label="Toggle advanced filters"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Advanced Filters Panel */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showFilters ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Filters</span>
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Room Type */}
                  <div className="space-y-1.5">
                    <label htmlFor="filter-type" className="text-xs font-semibold text-zinc-400">
                      Room Type
                    </label>
                    <select
                      id="filter-type"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="block w-full rounded-xl border-0 bg-zinc-950/60 py-2.5 px-3 text-white ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-xs transition-all"
                    >
                      <option value="all">All Room Types</option>
                      <option value="single">Single Room</option>
                      <option value="shared">Shared Room</option>
                      <option value="apartment">Apartment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Max Price */}
                  <div className="space-y-1.5">
                    <label htmlFor="filter-price" className="text-xs font-semibold text-zinc-400">
                      Max Monthly Rent (₹ INR)
                    </label>
                    <input
                      id="filter-price"
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="e.g. 5000"
                      className="block w-full rounded-xl border-0 bg-zinc-950/60 py-2.5 px-3 text-white ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-xs transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Availability */}
                  <div className="space-y-1.5">
                    <label htmlFor="filter-status" className="text-xs font-semibold text-zinc-400">
                      Availability Status
                    </label>
                    <select
                      id="filter-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="block w-full rounded-xl border-0 bg-zinc-950/60 py-2.5 px-3 text-white ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-xs transition-all"
                    >
                      <option value="available">Available Rooms Only</option>
                      <option value="all">All Statuses (incl. rented)</option>
                    </select>
                  </div>

                  {/* Max Distance Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="filter-distance" className="font-semibold text-zinc-400">
                        Max Distance to RGU
                      </label>
                      <span className="font-bold text-blue-400">{maxDistance} km</span>
                    </div>
                    <input
                      id="filter-distance"
                      type="range"
                      min="1"
                      max="15"
                      step="0.5"
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Listings count / info */}
          <div className="text-zinc-500 text-xs flex justify-between items-center">
            <span>Showing {filteredListings.length} matching rooms</span>
          </div>

          {/* Listings Grid */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredListings.map((room) => (
                <ListingCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-zinc-900/20 border border-zinc-900 border-dashed rounded-3xl">
              <p className="font-semibold text-zinc-300">No rooms found</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                Try widening your filters or search query to find student rooms nearby.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 rounded-xl transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Map (5 cols on desktop, toggled on mobile) */}
        <div
          className={`md:col-span-5 h-full ${
            activeTab === 'map' ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="w-full h-[calc(100vh-8rem)] md:h-full md:sticky md:top-16">
            <MapLoader listings={filteredListings} />
          </div>
        </div>
      </div>
    </div>
  )
}
