'use client'

import { signOut } from '@/lib/services/auth'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-800/80 rounded-xl transition-all cursor-pointer"
      aria-label="Sign out of your account"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  )
}
