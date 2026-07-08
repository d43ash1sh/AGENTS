import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getListingById } from '@/lib/services/listings'
import { getUser } from '@/lib/services/auth'
import MapLoader from '@/components/MapLoader'
import DeleteListingButton from '@/components/DeleteListingButton'
import { Calendar, Compass, Edit, MapPin, Phone, Sparkles, Tag, ChevronLeft, Building } from 'lucide-react'

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

  // Status badge styling helper
  const getStatusColor = (status: string) => {
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
    <div className="bg-zinc-950 min-h-screen text-white py-10 relative">
      
      {/* Background glow decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[130px]" />
        <div className="absolute bottom-[20%] left-[5%] w-[30%] h-[30%] rounded-full bg-indigo-600/20 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 relative">
        
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-zinc-900 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
              <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <span>/</span>
              <span className="text-zinc-200 truncate max-w-[200px] font-semibold">{listing.title}</span>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/listings/${listing.id}/edit`}
                className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-zinc-900 border border-zinc-800/80 hover:bg-zinc-850 hover:border-zinc-700 hover:text-white rounded-xl transition-all cursor-pointer active:scale-[0.98]"
              >
                <Edit className="w-4 h-4 text-zinc-400" />
                <span>Edit Room</span>
              </Link>
              <DeleteListingButton id={listing.id} />
            </div>
          )}
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Side: Room Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Title Block */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getStatusColor(listing.status)}`}>
                  {listing.status}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-blue-500/15 bg-blue-500/10 text-blue-400">
                  {listing.room_type} room
                </span>
              </div>
              
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white leading-tight">
                {listing.title}
              </h1>

              <div className="flex flex-col gap-3 text-zinc-400 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="text-zinc-300 font-medium">{listing.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-semibold text-blue-400 bg-blue-500/5 px-2.5 py-1 rounded-lg border border-blue-500/10">
                    {listing.distance_to_rgu} km from RGU campus center
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing & CTA Card */}
            <div className="bg-gradient-to-tr from-zinc-900/60 to-zinc-900/20 border border-zinc-800/80 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-xl shadow-black/10">
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Monthly rent</p>
                <div className="flex items-baseline mt-1 gap-1">
                  <span className="text-4xl font-black text-white">₹{listing.price}</span>
                  <span className="text-zinc-400 text-sm">/month</span>
                </div>
              </div>
              <a
                href={`tel:${listing.contact_phone}`}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Owner: {listing.contact_phone}</span>
              </a>
            </div>

            {/* Description Block */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>About this accommodation</span>
              </h3>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm sm:text-base bg-zinc-900/30 border border-zinc-850 p-6 rounded-3xl shadow-sm">
                {listing.description}
              </p>
            </div>

            {/* Amenities Block */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-400" />
                <span>Included Amenities</span>
              </h3>
              {listing.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {listing.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 text-xs font-semibold bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl hover:border-zinc-700 transition-colors"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-xs italic">No amenities specified for this listing.</p>
              )}
            </div>

            {/* Calendar metadata */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 pt-4 border-t border-zinc-900">
              <Calendar className="w-4 h-4 text-zinc-600" />
              <span>Posted on {new Date(listing.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Right Side: Map View (5 cols) */}
          <div className="lg:col-span-5 h-[350px] lg:h-[600px] flex flex-col space-y-4">
            <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-3xl">
              <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400" />
                <span>Room Location Mapping</span>
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1">
                Visualizing the listing position relative to the Rajiv Gandhi University campus (represented in red).
              </p>
            </div>
            
            <div className="flex-grow h-full min-h-[300px] rounded-3xl overflow-hidden shadow-2xl">
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
