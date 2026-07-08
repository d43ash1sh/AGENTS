'use client'

import { useRef, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { RGU_LATITUDE, RGU_LONGITUDE } from '@/lib/utils/distance'
import { Listing } from '@/lib/services/listings'
import Link from 'next/link'

// Resolve default Leaflet icon paths in Next.js
if (typeof window !== 'undefined') {
  const defaultIconPrototype = L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown }
  delete defaultIconPrototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

// Custom icons to differentiate RGU from standard rooms
const rguIcon = typeof window !== 'undefined' 
  ? new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  : undefined

const selectedIcon = typeof window !== 'undefined' 
  ? new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  : undefined

interface MapComponentProps {
  listings?: Listing[]
  markerPos?: { lat: number; lng: number }
  onCoordinateChange?: (lat: number, lng: number) => void
  readOnly?: boolean
}

// Helper to handle clicks on the map for coordinate picking
function MapEvents({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

export default function MapComponent({
  listings = [],
  markerPos,
  onCoordinateChange,
  readOnly = false,
}: MapComponentProps) {
  const markerRef = useRef<L.Marker>(null)

  // Memoize event handlers for dragging the listing marker
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null && onCoordinateChange) {
          const latLng = marker.getLatLng()
          onCoordinateChange(latLng.lat, latLng.lng)
        }
      },
    }),
    [onCoordinateChange]
  )

  // RGU reference marker coordinates
  const rguCoords: [number, number] = [RGU_LATITUDE, RGU_LONGITUDE]

  // Determine starting center coordinate
  let center: [number, number] = rguCoords
  if (markerPos) {
    center = [markerPos.lat, markerPos.lng]
  } else if (listings.length > 0) {
    center = [listings[0].latitude, listings[0].longitude]
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-zinc-800 shadow-lg relative bg-zinc-900">
      <MapContainer
        center={center}
        zoom={14}
        className="w-full h-full min-h-[300px]"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Rajiv Gandhi University (RGU) Pin */}
        <Marker position={rguCoords} icon={rguIcon}>
          <Popup>
            <div className="text-zinc-950 font-semibold text-center">
              Rajiv Gandhi University (RGU)
              <p className="text-xs text-zinc-500 font-normal mt-1">Reference Centerpoint</p>
            </div>
          </Popup>
        </Marker>

        {/* Single marker mode (Create/Edit Form or Detail view) */}
        {markerPos && (
          <Marker
            position={[markerPos.lat, markerPos.lng]}
            draggable={!readOnly && !!onCoordinateChange}
            eventHandlers={eventHandlers}
            ref={markerRef}
            icon={selectedIcon}
          >
            <Popup>
              <div className="text-zinc-950 font-semibold text-center">
                {readOnly ? 'Room Location' : 'Selected Location'}
                <p className="text-xs text-zinc-500 font-normal mt-1">
                  {!readOnly ? 'Drag me to adjust' : ''}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Multiple marker mode (Homepage map) */}
        {listings.map((room) => (
          <Marker key={room.id} position={[room.latitude, room.longitude]}>
            <Popup>
              <div className="text-zinc-900 font-sans p-1">
                <h4 className="font-bold text-sm leading-tight text-zinc-900">{room.title}</h4>
                <p className="text-xs text-zinc-500 mt-0.5">{room.address}</p>
                <div className="flex justify-between items-center gap-4 mt-2">
                  <span className="text-xs font-semibold bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded uppercase">
                    {room.room_type}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {room.distance_to_rgu} km to RGU
                  </span>
                </div>
                <div className="border-t border-zinc-100 mt-2 pt-2 flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-600">₹{room.price}/mo</span>
                  <Link
                    href={`/listings/${room.id}`}
                    className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded transition-colors !no-underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Handle map clicks for picking coordinates (Create/Edit mode) */}
        {!readOnly && onCoordinateChange && (
          <MapEvents onMapClick={onCoordinateChange} />
        )}
      </MapContainer>
      
      {/* Visual coordinates display on map overlays */}
      {!readOnly && onCoordinateChange && markerPos && (
        <div className="absolute bottom-2 left-2 z-[1000] bg-zinc-950/90 text-zinc-300 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-[10px] sm:text-xs">
          Coordinates: {markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}
        </div>
      )}
    </div>
  )
}
