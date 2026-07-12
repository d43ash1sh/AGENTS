import React from 'react'

export default function AboutPage() {
  return (
    <div className="bg-[#ffffff] min-h-screen text-black py-24 relative w-full overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[20%] w-[35%] h-[35%] rounded-full bg-blue-500/5 blur-[160px] radial-glow" />
      </div>

      <div className="mx-auto w-full max-w-[800px] px-6 sm:px-8 z-10 relative space-y-12">
        <div className="space-y-4">
          <span className="caveman-label text-[10px]">Platform Identity</span>
          <h1 className="caveman-hero text-4xl sm:text-6xl tracking-tight leading-tight text-black">
            about NestRGU
          </h1>
          <p className="text-sm sm:text-base text-black/55 font-light leading-relaxed">
            A minimalist, direct-to-owner database of student rooms and shared flats surrounding Rajiv Gandhi University, Doimukh. Built with precision for students who want to cut the noise.
          </p>
        </div>

        <div className="border-t border-black/5 pt-10 space-y-6">
          <h2 className="caveman-title text-xl text-black">Our Philosophy</h2>
          <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-light">
            Finding student housing shouldn&apos;t involve dealing with shady brokers, hidden commissions, or out-of-date classified listings. We indexes properties with verified coordinates, clear walking times to campus, and direct phone contact.
          </p>
        </div>

        <div className="border-t border-black/5 pt-10 space-y-6">
          <h2 className="caveman-title text-xl text-black">Open Indexing</h2>
          <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-light">
            Any property owner, roommate finder, or landlord can list a room for free. Each post must undergo coordinate mapping to verify the actual walking distance to Rajiv Gandhi University campus.
          </p>
        </div>

        <div className="border-t border-black/5 pt-10 text-[10px] font-mono text-black/40 uppercase tracking-widest">
          Version 1.0.0 • RoomNearRGU Team
        </div>
      </div>
    </div>
  )
}
