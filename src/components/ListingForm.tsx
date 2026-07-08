'use client'

import { useState, useActionState } from 'react'
import { RGU_LATITUDE, RGU_LONGITUDE } from '@/lib/utils/distance'
import MapLoader from './MapLoader'
import { Loader2, ArrowLeft, MapPin } from 'lucide-react'
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
  // Setup coordinate state, defaulting to RGU if no initial data
  const [coords, setCoords] = useState({
    lat: initialData?.latitude ?? RGU_LATITUDE,
    lng: initialData?.longitude ?? RGU_LONGITUDE,
  })

  const [state, formAction, isPending] = useActionState(action, null)

  const handleCoordinateChange = (lat: number, lng: number) => {
    setCoords({ lat, lng })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 relative">
      
      {/* Background glow decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[20%] w-[35%] h-[35%] rounded-full bg-blue-500/20 blur-[130px]" />
      </div>

      <div className="flex items-center gap-4 mb-8 z-10 relative">
        <Link
          href={initialData ? `/listings/${initialData.id}` : '/'}
          className="flex items-center justify-center p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer active:scale-[0.97]"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {initialData ? 'Edit Room Listing' : 'Post a New Room'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            {initialData ? 'Update details for this room accommodation' : 'Provide room details for students looking for housing near RGU'}
          </p>
        </div>
      </div>

      <form action={formAction} className="grid grid-cols-1 gap-8 lg:grid-cols-12 z-10 relative">
        {/* Form Inputs (Left 7 columns) */}
        <div className="lg:col-span-7 space-y-6 glass-panel p-6 sm:p-8 rounded-3xl shadow-xl shadow-black/10">
          
          {state?.error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
              {state.error}
            </div>
          )}

          {/* Hidden inputs to capture coordinates for form submission */}
          <input type="hidden" name="latitude" value={coords.lat} />
          <input type="hidden" name="longitude" value={coords.lng} />

          {/* Title Field */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
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
              className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3.5 px-4 text-white ring-1 ring-inset ring-zinc-850 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
              placeholder="Sleek Single Room near RGU Campus"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Price Field */}
            <div className="space-y-1.5">
              <label htmlFor="price" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
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
                className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3.5 px-4 text-white ring-1 ring-inset ring-zinc-850 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
                placeholder="4000"
              />
            </div>

            {/* Room Type Field */}
            <div className="space-y-1.5">
              <label htmlFor="room_type" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Room Type
              </label>
              <select
                name="room_type"
                id="room_type"
                required
                defaultValue={initialData?.room_type ?? 'single'}
                disabled={isPending}
                className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3.5 px-4 text-white ring-1 ring-inset ring-zinc-850 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all cursor-pointer"
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
              <label htmlFor="contact_phone" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
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
                className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3.5 px-4 text-white ring-1 ring-inset ring-zinc-850 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
                placeholder="9876543210"
              />
            </div>

            {/* Status (Only visible on Edit screen) */}
            {initialData && (
              <div className="space-y-1.5">
                <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Availability Status
                </label>
                <select
                  name="status"
                  id="status"
                  required
                  defaultValue={initialData?.status ?? 'available'}
                  disabled={isPending}
                  className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3.5 px-4 text-white ring-1 ring-inset ring-zinc-850 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all cursor-pointer"
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
            <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
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
              className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3.5 px-4 text-white ring-1 ring-inset ring-zinc-850 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all resize-none"
              placeholder="Provide information about water supply, power backup, distance to campus, target tenant type (boys/girls/any), etc."
            />
          </div>

          {/* Address Field */}
          <div className="space-y-1.5">
            <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
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
              className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3.5 px-4 text-white ring-1 ring-inset ring-zinc-850 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
              placeholder="Near RGU Main Gate, Doimukh"
            />
          </div>

          {/* Amenities Field */}
          <div className="space-y-1.5">
            <label htmlFor="amenities" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
              Amenities (Comma-separated)
            </label>
            <input
              type="text"
              name="amenities"
              id="amenities"
              defaultValue={initialData?.amenities?.join(', ')}
              disabled={isPending}
              className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3.5 px-4 text-white ring-1 ring-inset ring-zinc-850 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
              placeholder="Wifi, Water 24/7, Parking, Power Backup"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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
          <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-3xl space-y-2.5">
            <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Map Marker Picker</span>
            </h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Click anywhere on the OpenStreetMap canvas or drag the green marker pin to specify the exact geo-coordinates of the accommodation.
            </p>
          </div>
          
          <div className="flex-grow h-full min-h-[300px] rounded-3xl overflow-hidden shadow-2xl">
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
