import { redirect } from 'next/navigation'
import { getUser } from '@/lib/services/auth'
import { createListing } from '@/lib/services/listings'
import ListingForm from '@/components/ListingForm'

export const metadata = {
  title: 'Post New Room - RoomNearRGU',
  description: 'Create a new room listing near Rajiv Gandhi University',
}

export default async function NewListingPage() {
  const user = await getUser()

  // Redirect to login if user is not authenticated
  if (!user) {
    redirect('/login')
  }

  // Bind the state-less Server Action for form submission
  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <ListingForm
        action={createListing}
        submitLabel="Create Room Listing"
      />
    </div>
  )
}
