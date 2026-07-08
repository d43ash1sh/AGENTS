import { getListings } from '@/lib/services/listings'
import HomeContainer from '@/components/HomeContainer'

// Force Next.js to render this route dynamically because it reads from the database at request time
export const revalidate = 0

export default async function HomePage() {
  // Fetch all room listings (including rented ones, to allow filtering in-browser)
  const listings = await getListings({ status: 'all' })

  return <HomeContainer initialListings={listings} />
}
