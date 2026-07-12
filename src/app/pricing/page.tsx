import React from 'react'
import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="bg-[#ffffff] min-h-screen text-black py-24 relative w-full overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[30%] right-[10%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[160px] radial-glow" />
      </div>

      <div className="mx-auto w-full max-w-[900px] px-6 sm:px-8 z-10 relative space-y-12 text-center">
        
        {/* Header */}
        <div className="space-y-4 max-w-xl mx-auto">
          <span className="caveman-label text-[10px]">Listing tiers</span>
          <h1 className="caveman-hero text-4xl sm:text-6xl tracking-tight leading-none text-black">
            transparent listing pricing.
          </h1>
          <p className="text-xs sm:text-sm text-black/55 font-light leading-relaxed">
            Free forever for standard student roommate postings and basic listings. Premium tiers available for professional owners.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto pt-8">
          
          {/* Free Standard Tier */}
          <div className="bg-black/2 border border-black/8 p-6 rounded-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-black/45">Standard Posting</span>
                <h3 className="caveman-title text-xl text-black">Student Free</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-mono">₹0</span>
                <span className="text-[10px] font-mono text-black/35">/ forever</span>
              </div>
              <p className="text-xs text-black/60 leading-relaxed font-light">
                Perfect for students seeking roommates, flatmates, or sublets. Direct communication.
              </p>
              
              <ul className="space-y-2 pt-4 border-t border-black/5 text-xs text-black/70 font-mono">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>1 Active Listing</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Standard GPS Location</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Direct Owner Contacts</span>
                </li>
              </ul>
            </div>

            <Link
              href="/listings/new"
              className="block text-center w-full py-2.5 mt-6 border border-black/10 hover:border-black/25 hover:bg-black/3 text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer"
            >
              Deploy Free Post
            </Link>
          </div>

          {/* Premium Professional Tier */}
          <div className="bg-blue-50/20 border border-blue-500/20 p-6 rounded-xl space-y-6 flex flex-col justify-between relative">
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded font-mono text-[8px] uppercase tracking-wider text-blue-600 font-semibold">
              Popular
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-blue-600 font-semibold">Landlords & Owners</span>
                <h3 className="caveman-title text-xl text-black">Owner Pro</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-mono">₹499</span>
                <span className="text-[10px] font-mono text-black/35">/ month</span>
              </div>
              <p className="text-xs text-black/60 leading-relaxed font-light">
                Ideal for property owners, hostels, and professional landlords with multiple rooms.
              </p>
              
              <ul className="space-y-2 pt-4 border-t border-black/5 text-xs text-black/70 font-mono">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Unlimited Listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Priority Verification Index</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Advanced Performance Stats</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Featured Map Pin Glow</span>
                </li>
              </ul>
            </div>

            <Link
              href="/listings/new?pro=true"
              className="block text-center w-full py-2.5 mt-6 bg-black hover:bg-black/90 text-white font-mono text-xs uppercase tracking-wider rounded transition-all active:scale-[0.985] cursor-pointer shadow-md shadow-black/10"
            >
              Acquire Pro Index
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
