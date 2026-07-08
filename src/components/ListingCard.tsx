import Link from 'next/link'
import { Listing } from '@/lib/services/listings'
import { MapPin, Compass, Phone, ArrowRight } from 'lucide-react'

interface ListingCardProps {
  room: Listing
}

export default function ListingCard({ room }: ListingCardProps) {
  // Status badge styling helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'rented':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
    }
  }

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-5 hover:border-zinc-700 hover:bg-zinc-900/60 hover:shadow-xl hover:shadow-blue-500/[0.02] active:scale-[0.99] transition-all duration-300">
      <div className="space-y-3">
        {/* Badges & Price */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStatusColor(room.status)}`}>
              {room.status}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-blue-500/20 bg-blue-500/10 text-blue-400">
              {room.room_type}
            </span>
          </div>
          <span className="font-extrabold text-blue-400 text-base">
            ₹{room.price}/mo
          </span>
        </div>

        {/* Title */}
        <Link href={`/listings/${room.id}`} className="block group/title">
          <h3 className="font-bold text-white text-lg leading-snug group-hover/title:text-blue-400 transition-colors line-clamp-1">
            {room.title}
          </h3>
        </Link>

        {/* Details (Address, Distance) */}
        <div className="space-y-1.5 text-zinc-400 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="line-clamp-1">{room.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-semibold text-zinc-300">
              {room.distance_to_rgu} km from RGU campus
            </span>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
          {room.description}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-4">
        <a
          href={`tel:${room.contact_phone}`}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Owner</span>
        </a>
        
        <Link
          href={`/listings/${room.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors"
        >
          <span>View Room</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  )
}
