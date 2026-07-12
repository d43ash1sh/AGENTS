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
      className="flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-red-600 hover:text-red-700 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 rounded transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      aria-label="Delete this listing"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      <span>Delete Listing</span>
    </button>
  )
}
