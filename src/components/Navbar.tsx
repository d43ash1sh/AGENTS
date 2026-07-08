import Link from 'next/link'
import { getUser } from '@/lib/services/auth'
import SignOutButton from './SignOutButton'
import { PlusCircle, User } from 'lucide-react'

export default async function Navbar() {
  const user = await getUser()

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20">
                <span className="font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                RoomNearRGU
              </span>
            </Link>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/listings/new"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Post Room</span>
                </Link>
                <div className="hidden md:flex items-center gap-1.5 text-zinc-400 text-sm border-r border-zinc-800 pr-4 mr-1">
                  <User className="w-4 h-4 text-zinc-500" />
                  <span className="max-w-[150px] truncate" title={user.email}>
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <SignOutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
