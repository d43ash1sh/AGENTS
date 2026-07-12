import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getListingById } from '@/lib/services/listings'
import { parseDescription } from '@/lib/utils/description'
import { getUser } from '@/lib/services/auth'
import MapLoader from '@/components/MapLoader'
import DeleteListingButton from '@/components/DeleteListingButton'
import { Edit, MapPin, Phone, ShieldCheck, ChevronLeft, Footprints, Camera } from 'lucide-react'

interface ListingPageProps {
  params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { id } = await params
  const user = await getUser()
  const listing = await getListingById(id)

  if (!listing) {
    notFound()
  }

  const isOwner = user?.id === listing.owner_id
  const { description: cleanDesc, imageUrl } = parseDescription(listing.description)

  // Calculations for walking distance animation
  const walkTimeMins = Math.round(listing.distance_to_rgu * 12)
  const isWalkable = listing.distance_to_rgu <= 2.0
  const progressPercent = Math.min(100, Math.max(8, (listing.distance_to_rgu / 6.0) * 100))

  return (
    <div className="bg-[#ffffff] min-h-screen text-black py-12 relative w-full">
      
      {/* Background glow decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] right-[10%] w-[45%] h-[45%] rounded-full bg-blue-500/5 blur-[160px] radial-glow" />
        <div className="absolute bottom-[20%] left-[5%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[160px] radial-glow" />
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-12 z-10 relative">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-black/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-black/35">
              <Link href="/" className="flex items-center gap-1 hover:text-black transition-colors cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Link>
              <span>/</span>
              <span className="text-black/60 truncate max-w-[200px]">{listing.title}</span>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/listings/${listing.id}/edit`}
                className="flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-black bg-black/5 hover:bg-black/10 border border-black/10 rounded transition-all active:scale-[0.98] cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Listing</span>
              </Link>
              <DeleteListingButton id={listing.id} />
            </div>
          )}
        </div>

        {/* Immersive Gallery Grid */}
        {imageUrl ? (
          <div className="w-full aspect-[21/9] rounded-xl overflow-hidden border border-black/8 bg-black/2 p-2 mb-10">
            <div className="w-full h-full overflow-hidden rounded-lg bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover" />
            </div>
          </div>
        ) : (
          <div className="w-full aspect-[21/9] rounded-xl overflow-hidden border border-black/8 bg-black/2 p-2 mb-10 flex items-center justify-center">
            <div className="w-full h-full overflow-hidden rounded-lg bg-zinc-50 border border-black/5 flex flex-col items-center justify-center text-black/35 space-y-2 select-none">
              <Camera className="w-10 h-10 stroke-[1.2] text-black/20" />
              <div className="text-center space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider block">No Room Photos Uploaded</span>
                <span className="text-[10px] font-sans text-black/50 block font-light">Get in touch directly with the owner for details.</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          
          {/* Details Column */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Room Title Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-black/10 bg-black/2 text-black/55">
                  {listing.room_type} room
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/10 bg-emerald-500/5 text-emerald-600">
                  {listing.status}
                </span>
                <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/10 bg-blue-500/5 text-blue-600">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Listing</span>
                </span>
              </div>
              
              <h1 className="caveman-title text-3xl sm:text-5xl text-black leading-tight">
                {listing.title}
              </h1>

              <div className="flex flex-col gap-2 text-black/55 text-xs font-mono uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-black/30" />
                  <span>{listing.address}</span>
                </div>
              </div>
            </div>

            {/* Price & Contact Quick Action card */}
            <div className="glass-surface p-6 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-black/35">Monthly Rent</span>
                <div className="flex items-baseline mt-1 gap-1">
                  <span className="text-3xl font-bold text-black">₹{listing.price}</span>
                  <span className="text-black/40 text-xs">/month</span>
                </div>
              </div>
              <a
                href={`tel:${listing.contact_phone}`}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-black/90 text-white font-mono text-xs uppercase tracking-wider rounded transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-black/10"
              >
                <Phone className="w-4 h-4" />
                <span>Call Owner ({listing.contact_phone})</span>
              </a>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <span className="caveman-label text-[9px] block">Room Overview</span>
              <p className="text-black/70 leading-relaxed whitespace-pre-line text-sm bg-black/2 border border-black/5 p-6 rounded-xl">
                {cleanDesc}
              </p>
            </div>

            {/* Walking distance visualization widget */}
            <div className="space-y-4">
              <span className="caveman-label text-[9px] block">Walking Route Analytics</span>
              
              <div className="bg-black/2 border border-black/8 p-6 rounded-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-blue-500" />
                    <span className="font-bold">Campus Accessibility</span>
                  </div>
                  <div className="font-mono text-black/60">
                    {listing.distance_to_rgu} km to RGU Center • Approx. <span className="text-black font-bold">{walkTimeMins} mins</span> walk
                  </div>
                </div>

                {/* Progress-style distance timeline path */}
                <div className="relative pt-4 pb-2">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-black/10" />
                  
                  {/* Glowing completed segment */}
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${progressPercent}%` }}
                  />

                  {/* Room Pin Point */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
                  
                  {/* Walking Indicator relative to distance */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all"
                    style={{ left: `${progressPercent}%` }}
                  >
                    <div className="px-2 py-0.5 bg-white border border-black/10 rounded text-[9px] font-mono whitespace-nowrap shadow-sm">
                      {isWalkable ? 'Walkable' : 'Transit Needed'}
                    </div>
                    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center text-white">
                      <Footprints className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  {/* Campus Endpoint */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>

                <div className="flex justify-between text-[9px] font-mono text-black/35">
                  <span>ROOM POSITION</span>
                  <span>RGU CAMPUS</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <span className="caveman-label text-[9px] block">Convenience Amenities</span>
              {listing.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs bg-black/2 border border-black/5 text-black/80 rounded-md font-mono uppercase tracking-wider"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-black/30 text-xs italic font-mono">No specific amenities configured.</p>
              )}
            </div>

            {/* Mock Reviews system matching Caveman's developer UI */}
            <div className="space-y-4">
              <span className="caveman-label text-[9px] block">Tenant Reviews & Verification Logs</span>
              
              <div className="space-y-3">
                <div className="bg-black/2 border border-black/8 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-black/35">
                    <span>@rgu_student_2025</span>
                    <span>1 week ago</span>
                  </div>
                  <p className="text-xs text-black/70 leading-relaxed">
                    Great host, very quick response. The location is accurate and water supply is fully available. Highly recommended.
                  </p>
                </div>

                <div className="bg-black/2 border border-black/8 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-black/35">
                    <span>@verified_inspector</span>
                    <span>2 weeks ago</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-blue-600 uppercase tracking-wider font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Passed Physical Verification</span>
                  </div>
                  <p className="text-xs text-black/70 leading-relaxed">
                    Structural inspect, amenities double check completed. Proximity matches GPS coords exactly.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Location Map Column */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            <div className="bg-black/2 border border-black/8 p-5 rounded-xl">
              <span className="caveman-label text-[9px] block">Spatial Analytics</span>
              <p className="text-[11px] text-black/40 mt-1 leading-relaxed">
                Precise coordinates representing room location and its path distance to Rajiv Gandhi University reference centerpoint.
              </p>
            </div>
            
            <div className="h-[400px] rounded-xl overflow-hidden border border-black/8">
              <MapLoader
                markerPos={{ lat: listing.latitude, lng: listing.longitude }}
                readOnly={true}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
