import { notFound, redirect } from 'next/navigation'
import { getUser } from '@/lib/services/auth'
import { getListingById, updateListing } from '@/lib/services/listings'
import ListingForm from '@/components/ListingForm'

export const metadata = {
  title: 'Edit Room Listing - RoomNearRGU',
  description: 'Update your accommodation details near Rajiv Gandhi University',
}

interface EditListingPageProps {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const listing = await getListingById(id)

  if (!listing) {
    notFound()
  }

  // Ensure only the owner can edit
  if (listing.owner_id !== user.id) {
    redirect(`/listings/${id}`)
  }

  // Bind the listing ID to the server action so it can be updated
  const updateActionWithId = updateListing.bind(null, id)

  return (
    <div className="bg-[#ffffff] min-h-screen text-black">
      <ListingForm
        initialData={listing}
        action={updateActionWithId}
        submitLabel="Save Changes"
      />
    </div>
  )
}
