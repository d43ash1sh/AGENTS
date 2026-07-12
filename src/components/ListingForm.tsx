'use client'

import { useState, useActionState } from 'react'
import { RGU_LATITUDE, RGU_LONGITUDE } from '@/lib/utils/distance'
import MapLoader from './MapLoader'
import { Loader2, ArrowLeft, MapPin, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Listing } from '@/lib/services/listings'

interface ListingFormProps {
  initialData?: Listing
  action: (
    prevState: { error?: string; success?: string } | null,
    formData: FormData
  ) => Promise<{ error?: string; success?: string } | null>
  submitLabel: string
}

export default function ListingForm({ initialData, action, submitLabel }: ListingFormProps) {
  const [coords, setCoords] = useState({
    lat: initialData?.latitude ?? RGU_LATITUDE,
    lng: initialData?.longitude ?? RGU_LONGITUDE,
  })

  const [state, formAction, isPending] = useActionState(action, null)

  const handleCoordinateChange = (lat: number, lng: number) => {
    setCoords({ lat, lng })
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 relative w-full pt-20">
      
      {/* Background glow decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[20%] w-[35%] h-[35%] rounded-full bg-blue-500/5 blur-[160px] radial-glow" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 z-10 relative">
        <Link
          href={initialData ? `/listings/${initialData.id}` : '/'}
          className="flex items-center justify-center p-2 rounded bg-black/5 border border-black/10 text-black/50 hover:text-black transition-all cursor-pointer active:scale-[0.97]"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="caveman-title text-2xl sm:text-3xl text-black">
            {initialData ? 'edit room listing' : 'post a new room'}
          </h1>
          <p className="text-xs text-black/55 leading-relaxed font-light">
            {initialData 
              ? 'Update the parameters and location of this room' 
              : 'Add your property to the Rajiv Gandhi University student accommodation directory'}
          </p>
        </div>
      </div>

      <form action={formAction} className="grid grid-cols-1 gap-8 lg:grid-cols-12 z-10 relative">
        
        {/* Form Inputs (Left 7 columns) */}
        <div className="lg:col-span-7 space-y-5 bg-black/2 border border-black/8 p-6 sm:p-8 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
          
          {state?.error && (
            <div className="p-3.5 rounded border border-red-500/10 bg-red-500/5 text-red-600 text-xs font-mono" role="alert">
              {state.error}
            </div>
          )}

          {/* Hidden inputs to capture coordinates for form submission */}
          <input type="hidden" name="latitude" value={coords.lat} />
          <input type="hidden" name="longitude" value={coords.lng} />

          {/* Title Field */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block font-mono text-[9px] uppercase tracking-wider text-black/45">
              Listing Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              minLength={3}
              defaultValue={initialData?.title}
              disabled={isPending}
              className="block w-full rounded bg-[#ffffff] border border-black/8 focus:border-black/20 focus:outline-none py-3 px-4 text-black placeholder-black/25 text-xs transition-colors"
              placeholder="Single Room near RGU Campus"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Price Field */}
            <div className="space-y-1.5">
              <label htmlFor="price" className="block font-mono text-[9px] uppercase tracking-wider text-black/45">
                Monthly Rent (₹ INR)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                required
                min={0}
                defaultValue={initialData?.price}
                disabled={isPending}
                className="block w-full rounded bg-[#ffffff] border border-black/8 focus:border-black/20 focus:outline-none py-3 px-4 text-black placeholder-black/25 text-xs transition-colors"
                placeholder="4000"
              />
            </div>

            {/* Room Type Field */}
            <div className="space-y-1.5">
              <label htmlFor="room_type" className="block font-mono text-[9px] uppercase tracking-wider text-black/45">
                Room Type
              </label>
              <select
                name="room_type"
                id="room_type"
                required
                defaultValue={initialData?.room_type ?? 'single'}
                disabled={isPending}
                className="block w-full rounded bg-[#ffffff] border border-black/8 focus:border-black/20 focus:outline-none py-3 px-4 text-black text-xs transition-colors cursor-pointer"
              >
                <option value="single">Single Room</option>
                <option value="shared">Shared Room</option>
                <option value="apartment">Apartment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label htmlFor="contact_phone" className="block font-mono text-[9px] uppercase tracking-wider text-black/45">
                Contact Phone Number
              </label>
              <input
                type="tel"
                name="contact_phone"
                id="contact_phone"
                required
                minLength={8}
                defaultValue={initialData?.contact_phone}
                disabled={isPending}
                className="block w-full rounded bg-[#ffffff] border border-black/8 focus:border-black/20 focus:outline-none py-3 px-4 text-black placeholder-black/25 text-xs transition-colors"
                placeholder="9876543210"
              />
            </div>

            {/* Status (Only visible on Edit screen) */}
            {initialData && (
              <div className="space-y-1.5">
                <label htmlFor="status" className="block font-mono text-[9px] uppercase tracking-wider text-black/45">
                  Availability Status
                </label>
                <select
                  name="status"
                  id="status"
                  required
                  defaultValue={initialData?.status ?? 'available'}
                  disabled={isPending}
                  className="block w-full rounded bg-[#ffffff] border border-black/8 focus:border-black/20 focus:outline-none py-3 px-4 text-black text-xs transition-colors cursor-pointer"
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="block font-mono text-[9px] uppercase tracking-wider text-black/45">
              Detailed Description
            </label>
            <textarea
              name="description"
              id="description"
              required
              minLength={10}
              rows={4}
              defaultValue={initialData?.description}
              disabled={isPending}
              className="block w-full rounded bg-[#ffffff] border border-black/8 focus:border-black/20 focus:outline-none py-3 px-4 text-black placeholder-black/25 text-xs transition-colors resize-none"
              placeholder="Provide information about water supply, power backup, distance to campus, target tenant type (boys/girls/any), etc."
            />
          </div>

          {/* Address Field */}
          <div className="space-y-1.5">
            <label htmlFor="address" className="block font-mono text-[9px] uppercase tracking-wider text-black/45">
              Address Location
            </label>
            <input
              type="text"
              name="address"
              id="address"
              required
              minLength={5}
              defaultValue={initialData?.address}
              disabled={isPending}
              className="block w-full rounded bg-[#ffffff] border border-black/8 focus:border-black/20 focus:outline-none py-3 px-4 text-black placeholder-black/25 text-xs transition-colors"
              placeholder="Near RGU Main Gate, Doimukh"
            />
          </div>

          {/* Amenities Field */}
          <div className="space-y-1.5">
            <label htmlFor="amenities" className="block font-mono text-[9px] uppercase tracking-wider text-black/45">
              Amenities (Comma-separated)
            </label>
            <input
              type="text"
              name="amenities"
              id="amenities"
              defaultValue={initialData?.amenities?.join(', ')}
              disabled={isPending}
              className="block w-full rounded bg-[#ffffff] border border-black/8 focus:border-black/20 focus:outline-none py-3 px-4 text-black placeholder-black/25 text-xs transition-colors"
              placeholder="Wifi, Water 24/7, Parking, Power Backup"
            />
          </div>

          {/* Optional Image Upload Field */}
          <div className="space-y-1.5">
            <label htmlFor="image" className="block font-mono text-[9px] uppercase tracking-wider text-black/45">
              Optional Room Photo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                disabled={isPending}
                className="block w-full text-xs text-black/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-mono file:uppercase file:tracking-wider file:bg-black file:text-white file:hover:bg-black/90 file:cursor-pointer transition-colors bg-[#ffffff] border border-black/8 rounded px-3 py-1.5"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded bg-black hover:bg-black/90 px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-md shadow-black/10"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Saving Listing...</span>
              </>
            ) : (
              <span>{submitLabel}</span>
            )}
          </button>
        </div>

        {/* Map Picker (Right 5 columns) */}
        <div className="lg:col-span-5 flex flex-col space-y-4 h-[400px] lg:h-auto min-h-[400px]">
          <div className="bg-black/2 border border-black/8 p-5 rounded-xl space-y-2">
            <h3 className="text-xs font-semibold text-black flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>Map Marker Coordinate Picker</span>
            </h3>
            <p className="text-[10px] text-black/55 leading-relaxed font-light">
              Click anywhere on the map or drag the blue marker to specify the exact geo-coordinates of the room.
            </p>
          </div>
          
          <div className="flex-grow h-full min-h-[300px] rounded-xl overflow-hidden">
            <MapLoader
              markerPos={coords}
              onCoordinateChange={handleCoordinateChange}
              readOnly={isPending}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
