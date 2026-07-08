'use client'

import { useState, useActionState } from 'react'
import { RGU_LATITUDE, RGU_LONGITUDE } from '@/lib/utils/distance'
import MapLoader from './MapLoader'
import { Loader2, ArrowLeft } from 'lucide-react'
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={initialData ? `/listings/${initialData.id}` : '/'}
          className="flex items-center justify-center p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {initialData ? 'Edit Listing' : 'Post a New Room'}
          </h1>
          <p className="text-sm text-zinc-400">
            {initialData ? 'Update details for this room' : 'Share room details for students around RGU'}
          </p>
        </div>
      </div>

      <form action={formAction} className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Form Inputs (Left 3 columns) */}
        <div className="lg:col-span-3 space-y-6 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-lg">
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
            <label htmlFor="title" className="block text-sm font-semibold text-zinc-300">
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
              className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3 px-4 text-white ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
              placeholder="Sleek Single Room near RGU Campus"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Price Field */}
            <div className="space-y-1.5">
              <label htmlFor="price" className="block text-sm font-semibold text-zinc-300">
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
                className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3 px-4 text-white ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
                placeholder="4000"
              />
            </div>

            {/* Room Type Field */}
            <div className="space-y-1.5">
              <label htmlFor="room_type" className="block text-sm font-semibold text-zinc-300">
                Room Type
              </label>
              <select
                name="room_type"
                id="room_type"
                required
                defaultValue={initialData?.room_type ?? 'single'}
                disabled={isPending}
                className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3 px-4 text-white ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
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
              <label htmlFor="contact_phone" className="block text-sm font-semibold text-zinc-300">
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
                className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3 px-4 text-white ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
                placeholder="9876543210"
              />
            </div>

            {/* Status (Only visible on Edit screen) */}
            {initialData && (
              <div className="space-y-1.5">
                <label htmlFor="status" className="block text-sm font-semibold text-zinc-300">
                  Availability Status
                </label>
                <select
                  name="status"
                  id="status"
                  required
                  defaultValue={initialData?.status ?? 'available'}
                  disabled={isPending}
                  className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3 px-4 text-white ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
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
            <label htmlFor="description" className="block text-sm font-semibold text-zinc-300">
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
              className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3 px-4 text-white ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all resize-none"
              placeholder="Provide information about water supply, power backup, distance to campus gate, target tenant type (boys/girls/any), etc."
            />
          </div>

          {/* Address Field */}
          <div className="space-y-1.5">
            <label htmlFor="address" className="block text-sm font-semibold text-zinc-300">
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
              className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3 px-4 text-white ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
              placeholder="Near RGU Main Gate, Doimukh"
            />
          </div>

          {/* Amenities Field */}
          <div className="space-y-1.5">
            <label htmlFor="amenities" className="block text-sm font-semibold text-zinc-300">
              Amenities (Comma-separated)
            </label>
            <input
              type="text"
              name="amenities"
              id="amenities"
              defaultValue={initialData?.amenities?.join(', ')}
              disabled={isPending}
              className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3 px-4 text-white ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6 transition-all"
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

        {/* Map Picker (Right 2 columns) */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-3xl space-y-2">
            <h3 className="text-sm font-semibold text-zinc-300">Choose Coordinates</h3>
            <p className="text-xs text-zinc-500">
              Click anywhere on the map or drag the green pin to set the exact coordinates of the accommodation.
            </p>
          </div>
          
          <div className="flex-grow h-[350px] lg:h-full min-h-[350px]">
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
