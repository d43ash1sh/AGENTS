'use client'

import { signOut } from '@/lib/services/auth'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded transition-all cursor-pointer"
      aria-label="Sign out of your account"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Sign Out</span>
    </button>
  )
}
