'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Listing } from '@/lib/services/listings'
import { parseDescription } from '@/lib/utils/description'
import { MapPin, Navigation, Phone, ArrowUpRight, ShieldCheck, Image as ImageIcon } from 'lucide-react'

interface ListingCardProps {
  room: Listing
}

export default function ListingCard({ room }: ListingCardProps) {
  const { description: cleanDesc, imageUrl } = parseDescription(room.description)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
      case 'rented':
        return 'text-amber-600 bg-amber-500/10 border-amber-500/20'
      default:
        return 'text-black/35 bg-black/2 border-black/5'
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-black/8 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-black/15 hover:shadow-[0_20px_48px_-12px_rgba(0,0,0,0.08)] transition-all duration-200"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black/2 border-b border-black/8 flex items-center justify-center">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={room.title}
            className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-103"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-black/25 space-y-1 select-none">
            <ImageIcon className="w-6 h-6 stroke-[1.2]" />
            <span className="font-mono text-[8px] uppercase tracking-wider">No Room Photo</span>
          </div>
        )}
        
        {/* Top Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex gap-2">
            <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(room.status)}`}>
              {room.status}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-black/10 bg-white/90 text-black/80">
              {room.room_type}
            </span>
          </div>
          
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-black/5 text-black px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Verified</span>
          </div>
        </div>
        
        {/* Price Card overlay */}
        <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-md px-2.5 py-1 rounded z-10">
          <span className="font-bold text-sm text-white">₹{room.price}</span>
          <span className="text-[9px] font-mono text-white/40 ml-1">/mo</span>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between gap-4">
        
        <div className="space-y-2.5">
          {/* Proximity */}
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-black/45">
            <Navigation className="w-3 h-3 text-blue-500" />
            <span>{room.distance_to_rgu} km from RGU campus</span>
          </div>

          <div className="space-y-1">
            <Link href={`/listings/${room.id}`} className="block group/title">
              <h3 className="caveman-title text-base text-black hover:text-black/75 transition-colors line-clamp-1">
                {room.title}
              </h3>
            </Link>
            
            {/* Address */}
            <div className="flex items-center gap-1.5 text-black/40 text-xs">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">{room.address}</span>
            </div>
          </div>

          {/* Description snippet */}
          <p className="text-black/60 text-xs leading-relaxed line-clamp-2">
            {cleanDesc}
          </p>

        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-black/5 flex items-center justify-between gap-4">
          <a
            href={`tel:${room.contact_phone}`}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-black/55 hover:text-black transition-colors duration-150 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Call room owner at ${room.contact_phone}`}
          >
            <Phone className="w-3 h-3 text-black/40" />
            <span>Call Owner</span>
          </a>
          
          <Link
            href={`/listings/${room.id}`}
            className="flex items-center gap-1 text-[11px] font-bold text-black hover:text-black/70 transition-colors cursor-pointer"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Link>
        </div>

      </div>
    </motion.article>
  )
}
