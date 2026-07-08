'use client'

import { deleteListing } from '@/lib/services/listings'
import { Trash2, Loader2 } from 'lucide-react'
import { useTransition } from 'react'

export default function DeleteListingButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this room listing? This action is permanent.'
    )
    if (confirmed) {
      startTransition(async () => {
        try {
          await deleteListing(id)
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to delete listing'
          window.alert(message)
        }
      })
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-400 hover:text-white bg-red-950/20 border border-red-900/60 hover:bg-red-900/50 rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      aria-label="Delete this listing"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      <span>Delete Listing</span>
    </button>
  )
}
