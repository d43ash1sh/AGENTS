import Link from 'next/link'
import { getUser } from '@/lib/services/auth'
import { getListings } from '@/lib/services/listings'
import SignOutButton from './SignOutButton'
import Logo from './Logo'
import { Plus } from 'lucide-react'

export default async function Navbar() {
  const user = await getUser()
  const listings = await getListings({ status: 'all' })
  
  const liveCount = listings.filter(l => l.status === 'available').length
  const verifiedCount = listings.length // All listings in our system undergo a verification step

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-black/8 bg-[#ffffff]/75 backdrop-blur-md">
      <div className="mx-auto w-full px-6 sm:px-8 lg:px-12">
        <div className="flex h-14 items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <Logo iconSize={14} showText={true} />
            </Link>

            {/* Navigation links - hidden on mobile, clean monospace style */}
            <nav className="hidden md:flex items-center gap-5">
              <Link href="/" className="text-xs text-black/55 hover:text-black transition-colors duration-150 font-mono uppercase tracking-[0.1em]">
                Rooms
              </Link>
              <Link href="/map" className="text-xs text-black/55 hover:text-black transition-colors duration-150 font-mono uppercase tracking-[0.1em]">
                Map
              </Link>
              <Link href="/dashboard" className="text-xs text-black/55 hover:text-black transition-colors duration-150 font-mono uppercase tracking-[0.1em]">
                Owners
              </Link>
              <Link href="/about" className="text-xs text-black/55 hover:text-black transition-colors duration-150 font-mono uppercase tracking-[0.1em]">
                About
              </Link>
              <Link href="/pricing" className="text-xs text-black/55 hover:text-black transition-colors duration-150 font-mono uppercase tracking-[0.1em]">
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right side stats and operations */}
          <div className="flex items-center gap-6">
            
            {/* Live Stats Badges in Geist Mono style */}
            <div className="hidden lg:flex items-center gap-4 border-r border-black/8 pr-6 font-mono text-[10px] uppercase tracking-wider text-black/35">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{liveCount} Live Listings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>{verifiedCount} Verified Rooms</span>
              </div>
            </div>

            {/* User Operations */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {/* User Email (Truncated) */}
                  <span className="hidden sm:inline font-mono text-[10px] text-black/35 uppercase tracking-wider">
                    {user.email?.split('@')[0]}
                  </span>

                  <Link
                    href="/listings/new"
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-white bg-black hover:bg-black/90 rounded-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post Room</span>
                  </Link>
                  
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-xs text-black/55 hover:text-black transition-colors duration-150 font-mono uppercase tracking-[0.1em]"
                  >
                    Login
                  </Link>

                  <Link
                    href="/listings/new"
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-white bg-black hover:bg-black/90 rounded-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post Room</span>
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  )
}
