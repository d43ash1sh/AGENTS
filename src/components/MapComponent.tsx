'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useEffect, useState } from 'react'
import { RGU_LATITUDE, RGU_LONGITUDE } from '@/lib/utils/distance'
import { Listing } from '@/lib/services/listings'
import Link from 'next/link'

// Imports for Leaflet fallback
import L from 'leaflet'
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup as LeafletPopup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface MapComponentProps {
  listings?: Listing[]
  markerPos?: { lat: number; lng: number }
  onCoordinateChange?: (lat: number, lng: number) => void
  readOnly?: boolean
}

// Global script loading state for Google Maps
let scriptLoadingPromise: Promise<void> | null = null

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  const win = window as any
  if (win.google?.maps) return Promise.resolve()

  if (!scriptLoadingPromise) {
    scriptLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = (e) => reject(e)
      document.head.appendChild(script)
    })
  }

  return scriptLoadingPromise
}

// Custom light/silver theme styling for Google Maps
const lightMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e9e9e9' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] }
]

// Leaflet specific icons
const leafletRguIcon = typeof window !== 'undefined'
  ? L.divIcon({
      className: 'glow-marker-rgu',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10],
    })
  : undefined

const leafletRoomIcon = typeof window !== 'undefined'
  ? L.divIcon({
      className: 'glow-marker-room',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
      popupAnchor: [0, -8],
    })
  : undefined

// Leaflet map events helper
function LeafletMapEvents({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
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
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  
  const [googleMapsFailed, setGoogleMapsFailed] = useState(false)
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false)
  const [googleAuthErrorMsg, setGoogleAuthErrorMsg] = useState<string | null>(null)

  const centerLat = markerPos ? markerPos.lat : (listings.length > 0 ? listings[0].latitude : RGU_LATITUDE)
  const centerLng = markerPos ? markerPos.lng : (listings.length > 0 ? listings[0].longitude : RGU_LONGITUDE)

  // Bind gm_authFailure to detect Google Maps auth/key loading errors
  useEffect(() => {
    if (typeof window === 'undefined') return

    const win = window as any
    win.gm_authFailure = () => {
      console.warn('Google Maps Authentication Failed. Gracefully falling back to Leaflet Dark Matter.')
      setGoogleMapsFailed(true)
      setGoogleAuthErrorMsg('API Key has restriction or missing billing. Active Leaflet fallback.')
    }
  }, [])

  // Initialize Google Maps
  useEffect(() => {
    if (googleMapsFailed) return
    let active = true

    async function initMap() {
      try {
        await loadGoogleMapsScript('AIzaSyDcBDUsXUkiO49h6T3eOCvlyHAUb5HIXUY')
        if (!active || !containerRef.current) return

        const win = window as any
        const google = win.google

        const mapOptions = {
          center: { lat: centerLat, lng: centerLng },
          zoom: 14,
          styles: lightMapStyle,
          disableDefaultUI: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }

        const map = new google.maps.Map(containerRef.current, mapOptions)
        mapRef.current = map
        setGoogleMapsLoaded(true)

        // Custom Overlay class for HTML styled neon glow markers
        class HTMLOverlay extends google.maps.OverlayView {
          private position: any
          private div: HTMLDivElement | null = null
          private contentHtml: string
          private markerClass: string

          constructor(position: { lat: number; lng: number }, contentHtml: string, markerClass: string) {
            super()
            this.position = position
            this.contentHtml = contentHtml
            this.markerClass = markerClass
          }

          onAdd() {
            this.div = document.createElement('div')
            this.div.style.position = 'absolute'
            this.div.className = this.markerClass
            this.div.innerHTML = this.contentHtml

            const panes = this.getPanes()
            panes.overlayImage.appendChild(this.div)
          }

          draw() {
            if (!this.div) return
            const projection = this.getProjection()
            if (!projection) return

            const latlng = new google.maps.LatLng(this.position.lat, this.position.lng)
            const pos = projection.fromLatLngToDivPixel(latlng)

            if (pos) {
              this.div.style.left = `${pos.x - this.div.offsetWidth / 2}px`
              this.div.style.top = `${pos.y - this.div.offsetHeight / 2}px`
            }
          }

          onRemove() {
            if (this.div && this.div.parentNode) {
              this.div.parentNode.removeChild(this.div)
              this.div = null
            }
          }
        }

        // Add RGU Centerpoint
        const rguOverlay = new HTMLOverlay(
          { lat: RGU_LATITUDE, lng: RGU_LONGITUDE },
          '<div class="glow-marker-rgu"></div>',
          'cursor-pointer'
        )
        rguOverlay.setMap(map)

        let activeInfoWindow: any = null

        // Add listings
        listings.forEach((room) => {
          const roomOverlay = new HTMLOverlay(
            { lat: room.latitude, lng: room.longitude },
            '<div class="glow-marker-room"></div>',
            'cursor-pointer'
          )
          roomOverlay.setMap(map)

          google.maps.event.addDomListener(roomOverlay, 'click', () => {
            if (activeInfoWindow) activeInfoWindow.close()

            const infoContent = `
              <div style="color: black; font-family: sans-serif; min-width: 180px; padding: 4px;">
                <h4 style="margin: 0; font-size: 13px; font-weight: bold; color: #111;">${room.title}</h4>
                <p style="margin: 4px 0 0 0; font-size: 10px; color: #666;">${room.address}</p>
                <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 9px; color: #888;">${room.distance_to_rgu} km to RGU</span>
                  <span style="font-size: 11px; font-weight: bold; color: #111;">₹${room.price}/mo</span>
                </div>
                <a href="/listings/${room.id}" style="display: block; margin-top: 8px; text-align: center; font-size: 10px; font-weight: bold; background: black; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none;">Details</a>
              </div>
            `
            const infoWindow = new google.maps.InfoWindow({
              content: infoContent,
              position: { lat: room.latitude, lng: room.longitude }
            })

            infoWindow.open(map)
            activeInfoWindow = infoWindow
          })
        })

        // Listing Drag Picker
        if (markerPos) {
          const pickerMarker = new google.maps.Marker({
            position: { lat: markerPos.lat, lng: markerPos.lng },
            map,
            draggable: !readOnly,
            animation: google.maps.Animation.DROP,
          })

          if (!readOnly && onCoordinateChange) {
            pickerMarker.addListener('dragend', () => {
              const pos = pickerMarker.getPosition()
              if (pos) {
                onCoordinateChange(pos.lat(), pos.lng())
              }
            })

            map.addListener('click', (e: any) => {
              if (e.latLng) {
                pickerMarker.setPosition(e.latLng)
                onCoordinateChange(e.latLng.lat(), e.latLng.lng())
              }
            })
          }
        }

      } catch (err) {
        console.warn('Google Maps failed to load, switching to Leaflet fallback.', err)
        setGoogleMapsFailed(true)
      }
    }

    initMap()

    return () => {
      active = false
    }
  }, [listings, markerPos, readOnly, centerLat, centerLng, googleMapsFailed, onCoordinateChange])

  // Center pan update
  useEffect(() => {
    if (!googleMapsFailed && mapRef.current) {
      mapRef.current.panTo({ lat: centerLat, lng: centerLng })
    }
  }, [centerLat, centerLng, googleMapsFailed])

  // RENDER LEAFLET FALLBACK
  if (googleMapsFailed) {
    const leafletCenter: [number, number] = [centerLat, centerLng]
    const leafletRguCoords: [number, number] = [RGU_LATITUDE, RGU_LONGITUDE]

    return (
      <div className="w-full h-full rounded-lg overflow-hidden border border-black/5 relative bg-[#ffffff] shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        
        {/* API key warning badge on the map */}
        {googleAuthErrorMsg && (
          <div className="absolute top-3 left-3 z-[1000] bg-amber-500/10 border border-amber-500/20 text-amber-600 font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded">
            Google Key Restricted • Leaflet Fallback Active
          </div>
        )}

        <MapContainer
          center={leafletCenter}
          zoom={14}
          className="w-full h-full min-h-[300px]"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* RGU Marker */}
          <LeafletMarker position={leafletRguCoords} icon={leafletRguIcon}>
            <LeafletPopup>
              <div className="font-sans text-xs text-black p-1 select-none">
                <span className="font-bold block">Rajiv Gandhi University</span>
                <span className="text-[10px] text-black/55 block mt-0.5">Reference Centerpoint</span>
              </div>
            </LeafletPopup>
          </LeafletMarker>

          {/* Single Marker picker */}
          {markerPos && (
            <LeafletMarker
              position={[markerPos.lat, markerPos.lng]}
              draggable={!readOnly && !!onCoordinateChange}
              icon={leafletRoomIcon}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target
                  if (marker != null && onCoordinateChange) {
                    const latLng = marker.getLatLng()
                    onCoordinateChange(latLng.lat, latLng.lng)
                  }
                }
              }}
            >
              <LeafletPopup>
                <div className="font-sans text-xs text-black p-1 select-none">
                  <span className="font-bold block">{readOnly ? 'Selected Location' : 'Pick Room Location'}</span>
                  {!readOnly && <span className="text-[10px] text-black/55 block mt-0.5">Drag to relocate pin</span>}
                </div>
              </LeafletPopup>
            </LeafletMarker>
          )}

          {/* Listings markers */}
          {listings.map((room) => (
            <LeafletMarker key={room.id} position={[room.latitude, room.longitude]} icon={leafletRoomIcon}>
              <LeafletPopup>
                <div className="font-sans text-black p-1 max-w-[200px]">
                  <h4 className="font-bold text-xs leading-tight line-clamp-1">{room.title}</h4>
                  <p className="text-[10px] text-black/55 mt-0.5 line-clamp-1">{room.address}</p>
                  <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-black/5 gap-4">
                    <span className="font-mono text-[10px] text-black/35">{room.distance_to_rgu} km to RGU</span>
                    <span className="font-bold text-xs text-black">₹{room.price}/mo</span>
                  </div>
                  <div className="mt-2.5">
                    <Link
                      href={`/listings/${room.id}`}
                      className="block text-center text-[10px] font-bold text-white bg-black hover:bg-black/90 px-2 py-1.5 rounded transition-colors !no-underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </LeafletPopup>
            </LeafletMarker>
          ))}

          {!readOnly && onCoordinateChange && (
            <LeafletMapEvents onMapClick={onCoordinateChange} />
          )}
        </MapContainer>

        {!readOnly && onCoordinateChange && markerPos && (
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 text-black/60 px-3 py-1.5 rounded border border-black/8 font-mono text-[9px] shadow-sm">
            GIS: {markerPos.lat.toFixed(6)} N, {markerPos.lng.toFixed(6)} E
          </div>
        )}
      </div>
    )
  }

  // RENDER GOOGLE MAPS
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-black/5 relative bg-[#ffffff] shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
      <div ref={containerRef} className="w-full h-full min-h-[300px]" />
      
      {!googleMapsLoaded && (
        <div className="absolute inset-0 bg-[#ffffff] flex flex-col items-center justify-center text-black/30 font-mono text-[10px] uppercase tracking-wider z-20">
          <svg className="animate-spin h-5 w-5 text-black/50" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}
      
      {!readOnly && onCoordinateChange && markerPos && (
        <div className="absolute bottom-3 left-3 z-[100] bg-white/90 text-black/60 px-3 py-1.5 rounded border border-black/8 font-mono text-[9px] select-none pointer-events-none shadow-sm">
          GIS: {markerPos.lat.toFixed(6)} N, {markerPos.lng.toFixed(6)} E
        </div>
      )}
    </div>
  )
}
