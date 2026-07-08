import Link from 'next/link'
import { Listing } from '@/lib/services/listings'
import { MapPin, Compass, Phone, ArrowUpRight } from 'lucide-react'

interface ListingCardProps {
  room: Listing
}

export default function ListingCard({ room }: ListingCardProps) {
  // Status pill colors mapping
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'rented':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-800'
    }
  }

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 hover:border-zinc-700 hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-blue-500/[0.03] active:scale-[0.99] transition-all duration-300">
      
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-600/0 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

      <div className="space-y-4">
        {/* Badges & Rent */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getStatusStyle(room.status)}`}>
              {room.status}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-blue-500/15 bg-blue-500/10 text-blue-400">
              {room.room_type}
            </span>
          </div>
          <div className="text-right">
            <span className="font-black text-xl text-blue-400">₹{room.price}</span>
            <span className="text-zinc-500 text-[10px] block leading-none mt-0.5">/month</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <Link href={`/listings/${room.id}`} className="block group/title">
            <h3 className="font-extrabold text-white text-lg leading-snug group-hover/title:text-blue-400 transition-colors line-clamp-1">
              {room.title}
            </h3>
          </Link>
          
          {/* Address location */}
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs sm:text-sm">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="line-clamp-1">{room.address}</span>
          </div>
        </div>

        {/* Distance Indicator badge */}
        <div className="inline-flex items-center gap-1.5 bg-zinc-950/60 border border-zinc-800/80 px-3 py-1.5 rounded-xl text-xs">
          <Compass className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="font-bold text-zinc-300">
            {room.distance_to_rgu} km
          </span>
          <span className="text-zinc-500">to RGU Campus</span>
        </div>

        {/* Description snippet */}
        <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
          {room.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-zinc-800/60 flex items-center justify-between gap-4">
        <a
          href={`tel:${room.contact_phone}`}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Call room owner at ${room.contact_phone}`}
        >
          <Phone className="w-3.5 h-3.5 text-zinc-500" />
          <span>Call Owner</span>
        </a>
        
        <Link
          href={`/listings/${room.id}`}
          className="flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors cursor-pointer"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  )
}
