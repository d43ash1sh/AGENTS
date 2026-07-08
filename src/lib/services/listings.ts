'use server'

import { createClient } from '@/lib/supabase/server'
import { calculateDistanceFromRGU } from '@/lib/utils/distance'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUser } from './auth'

export interface Listing {
  id: string
  created_at: string
  owner_id: string
  title: string
  description: string
  price: number
  address: string
  latitude: number
  longitude: number
  distance_to_rgu: number
  room_type: 'single' | 'shared' | 'apartment' | 'other'
  amenities: string[]
  status: 'available' | 'rented' | 'unavailable'
  contact_phone: string
}

export async function getListings(filters?: {
  query?: string
  minPrice?: number
  maxPrice?: number
  roomType?: string
  maxDistance?: number
  status?: string
}) {
  try {
    const supabase = await createClient()
    let query = supabase.from('listings').select('*').order('created_at', { ascending: false })

    if (filters?.query) {
      const q = filters.query.trim()
      // text search or ilike across title, description, address
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,address.ilike.%${q}%`)
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }

    if (filters?.roomType && filters.roomType !== 'all') {
      query = query.eq('room_type', filters.roomType)
    }

    if (filters?.maxDistance !== undefined) {
      query = query.lte('distance_to_rgu', filters.maxDistance)
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    } else {
      // Default to showing only available listings on homepage search unless specified
      query = query.eq('status', 'available')
    }

    const { data, error } = await query
    if (error) throw error
    return (data as Listing[]) || []
  } catch (error) {
    console.error('Error fetching listings:', error)
    return []
  }
}

export async function getListingById(id: string): Promise<Listing | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return data as Listing
  } catch {
    return null
  }
}

export type ListingState = {
  error?: string
  success?: string
} | null

export async function createListing(prevState: ListingState, formData: FormData): Promise<ListingState> {
  const user = await getUser()
  if (!user) {
    return { error: 'You must be signed in to create a listing.' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priceStr = formData.get('price') as string
  const address = formData.get('address') as string
  const latitudeStr = formData.get('latitude') as string
  const longitudeStr = formData.get('longitude') as string
  const room_type = formData.get('room_type') as string
  const amenitiesStr = formData.get('amenities') as string
  const contact_phone = formData.get('contact_phone') as string

  // Simple validation
  if (!title || title.length < 3) return { error: 'Title must be at least 3 characters.' }
  if (!description || description.length < 10) return { error: 'Description must be at least 10 characters.' }
  
  const price = parseFloat(priceStr)
  if (isNaN(price) || price < 0) return { error: 'Price must be a valid positive number.' }

  if (!address || address.length < 5) return { error: 'Address must be at least 5 characters.' }

  const latitude = parseFloat(latitudeStr)
  const longitude = parseFloat(longitudeStr)
  if (isNaN(latitude) || latitude < -90 || latitude > 90) return { error: 'Invalid latitude value.' }
  if (isNaN(longitude) || longitude < -180 || longitude > 180) return { error: 'Invalid longitude value.' }

  if (!['single', 'shared', 'apartment', 'other'].includes(room_type)) {
    return { error: 'Invalid room type.' }
  }

  if (!contact_phone || contact_phone.length < 8) return { error: 'Contact phone must be at least 8 characters.' }

  const amenities = amenitiesStr
    ? amenitiesStr.split(',').map((a) => a.trim()).filter(Boolean)
    : []

  // Calculate distance
  let distance_to_rgu = 0
  try {
    distance_to_rgu = calculateDistanceFromRGU(latitude, longitude)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Distance calculation error.'
    return { error: message }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('listings').insert({
    title,
    description,
    price,
    address,
    latitude,
    longitude,
    distance_to_rgu,
    room_type,
    amenities,
    contact_phone,
    owner_id: user.id,
    status: 'available',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  redirect('/')
}

export async function updateListing(listingId: string, prevState: ListingState, formData: FormData): Promise<ListingState> {
  const user = await getUser()
  if (!user) {
    return { error: 'You must be signed in to update a listing.' }
  }

  // Verify owner
  const current = await getListingById(listingId)
  if (!current) return { error: 'Listing not found.' }
  if (current.owner_id !== user.id) return { error: 'You are not authorized to edit this listing.' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priceStr = formData.get('price') as string
  const address = formData.get('address') as string
  const latitudeStr = formData.get('latitude') as string
  const longitudeStr = formData.get('longitude') as string
  const room_type = formData.get('room_type') as string
  const status = formData.get('status') as string
  const amenitiesStr = formData.get('amenities') as string
  const contact_phone = formData.get('contact_phone') as string

  // Simple validation
  if (!title || title.length < 3) return { error: 'Title must be at least 3 characters.' }
  if (!description || description.length < 10) return { error: 'Description must be at least 10 characters.' }
  
  const price = parseFloat(priceStr)
  if (isNaN(price) || price < 0) return { error: 'Price must be a valid positive number.' }

  if (!address || address.length < 5) return { error: 'Address must be at least 5 characters.' }

  const latitude = parseFloat(latitudeStr)
  const longitude = parseFloat(longitudeStr)
  if (isNaN(latitude) || latitude < -90 || latitude > 90) return { error: 'Invalid latitude value.' }
  if (isNaN(longitude) || longitude < -180 || longitude > 180) return { error: 'Invalid longitude value.' }

  if (!['single', 'shared', 'apartment', 'other'].includes(room_type)) {
    return { error: 'Invalid room type.' }
  }

  if (!['available', 'rented', 'unavailable'].includes(status)) {
    return { error: 'Invalid status.' }
  }

  if (!contact_phone || contact_phone.length < 8) return { error: 'Contact phone must be at least 8 characters.' }

  const amenities = amenitiesStr
    ? amenitiesStr.split(',').map((a) => a.trim()).filter(Boolean)
    : []

  // Calculate distance
  let distance_to_rgu = 0
  try {
    distance_to_rgu = calculateDistanceFromRGU(latitude, longitude)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Distance calculation error.'
    return { error: message }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('listings')
    .update({
      title,
      description,
      price,
      address,
      latitude,
      longitude,
      distance_to_rgu,
      room_type,
      status,
      amenities,
      contact_phone,
    })
    .eq('id', listingId)
    .eq('owner_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/listings/${listingId}`)
  revalidatePath('/')
  redirect(`/listings/${listingId}`)
}

export async function deleteListing(id: string) {
  const user = await getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const current = await getListingById(id)
  if (!current) throw new Error('Listing not found')
  if (current.owner_id !== user.id) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
  redirect('/')
}
