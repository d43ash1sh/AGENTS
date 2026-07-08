import Link from 'next/link'
import { getUser } from '@/lib/services/auth'
import SignOutButton from './SignOutButton'
import Logo from './Logo'
import { PlusCircle, User } from 'lucide-react'

export default async function Navbar() {
  const user = await getUser()

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="glass-panel w-full rounded-2xl px-4 sm:px-6 lg:px-8 shadow-xl shadow-black/10">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <Logo iconSize={30} showText={true} />
          </Link>

          {/* User Operations */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/listings/new"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer active:scale-[0.97]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Room</span>
                </Link>
                
                <div className="hidden md:flex items-center gap-1.5 text-zinc-400 text-sm border-r border-zinc-800 pr-4 mr-1">
                  <User className="w-4 h-4 text-zinc-500" />
                  <span className="max-w-[150px] truncate font-medium text-zinc-300" title={user.email}>
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                
                <SignOutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 rounded-xl transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-zinc-400" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
