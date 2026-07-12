import { getListings } from '@/lib/services/listings'
import MapLoader from '@/components/MapLoader'
import Link from 'next/link'


export const revalidate = 0

export default async function MapPage() {
  const listings = await getListings({ status: 'all' })
  const liveListings = listings.filter((l) => l.status === 'available')

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full relative flex overflow-hidden bg-[#ffffff] pt-14">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[150px] radial-glow" />
      </div>

      {/* Floating Control Hub */}
      <div className="absolute top-20 left-6 z-20 w-80 max-h-[85vh] overflow-y-auto hidden md:flex flex-col gap-4 p-4 rounded-xl border border-black/8 bg-[#ffffff]/85 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
        <div className="space-y-1">
          <span className="caveman-label text-[8px]">Live GIS Interface</span>
          <h2 className="caveman-title text-lg text-black">Spatial Index</h2>
          <p className="text-[10px] text-black/55 leading-relaxed font-light">
            Visualize student accommodations in real-time coordinates relative to the RGU campus reference.
          </p>
        </div>

        <div className="border-t border-black/5 pt-4 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-mono text-black/55">
            <span>INDEX SIZE</span>
            <span className="text-black font-bold">{listings.length} ROOMS</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-black/55">
            <span>LIVE STATUS</span>
            <span className="text-emerald-600 font-bold">{liveListings.length} ACTIVE</span>
          </div>
        </div>

        {/* Small floating scroll list of listings */}
        <div className="border-t border-black/5 pt-4 space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-black/45 block mb-1">Index Entries</span>
          <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
            {liveListings.map((room) => (
              <Link
                key={room.id}
                href={`/listings/${room.id}`}
                className="block p-2.5 rounded border border-black/5 bg-black/2 hover:border-black/12 transition-colors cursor-pointer group"
              >
                <h4 className="text-xs text-black font-semibold truncate group-hover:text-blue-600 transition-colors">
                  {room.title}
                </h4>
                <div className="flex justify-between items-center mt-1 text-[9px] font-mono text-black/45">
                  <span className="truncate max-w-[120px]">{room.address}</span>
                  <span className="text-black">₹{room.price}/mo</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Full-Screen Map Component */}
      <div className="flex-1 w-full h-full relative z-10">
        <MapLoader listings={listings} />
      </div>

      {/* Mobile Floating Marker Counts */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 md:hidden">
        <div className="px-3.5 py-2 rounded bg-white/95 border border-black/8 font-mono text-[9px] uppercase tracking-wider text-black flex items-center gap-2 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{liveListings.length} Active Rooms</span>
        </div>
      </div>

    </div>
  )
}
