import { getUser } from '@/lib/services/auth'
import { getListings } from '@/lib/services/listings'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShieldAlert, CheckCircle, Clock, Shield, Search } from 'lucide-react'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const user = await getUser()

  // For safety and MVP purposes, redirect unauthenticated users
  if (!user) {
    redirect('/login')
  }

  const listings = await getListings({ status: 'all' })

  // Decorate listings with deterministic mock admin values
  const queue = listings.map((l) => {
    const seed = l.title.charCodeAt(0) + l.title.charCodeAt(l.title.length - 1)
    const isReported = seed % 7 === 0
    const reportsCount = isReported ? (seed % 4) + 1 : 0
    const verifiedStatus = seed % 3 === 0 ? 'inspected' : 'pending'

    return {
      ...l,
      isReported,
      reportsCount,
      verifiedStatus,
    }
  })

  const reportedItems = queue.filter((item) => item.isReported)
  const pendingVerification = queue.filter((item) => item.verifiedStatus === 'pending')

  return (
    <div className="bg-[#ffffff] min-h-screen text-black py-12 relative w-full pt-20">
      {/* Background glow decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] right-[10%] w-[35%] h-[35%] rounded-full bg-blue-500/5 blur-[160px] radial-glow" />
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-12 z-10 relative flex flex-col lg:flex-row gap-8">
        
        {/* Left panel options - Linear inspired */}
        <div className="w-full lg:w-60 shrink-0 space-y-6">
          <div className="space-y-1">
            <span className="caveman-label text-[8px] block">Workspace MOD-01</span>
            <h2 className="caveman-title text-base text-black">Linear Moderation</h2>
          </div>

          <nav className="space-y-1">
            <div className="flex items-center justify-between p-2 rounded bg-black/5 border border-black/8 text-xs font-mono uppercase tracking-wider text-black">
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Verification Queue</span>
              </span>
              <span className="bg-black/10 px-1.5 py-0.5 rounded text-[10px]">{pendingVerification.length}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded hover:bg-black/3 text-xs font-mono uppercase tracking-wider text-black/55 hover:text-black transition-colors cursor-pointer">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>Reported Items</span>
              </span>
              <span className="bg-black/5 px-1.5 py-0.5 rounded text-[10px]">{reportedItems.length}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded hover:bg-black/3 text-xs font-mono uppercase tracking-wider text-black/55 hover:text-black transition-colors cursor-pointer">
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Index</span>
              </span>
              <span className="bg-black/5 px-1.5 py-0.5 rounded text-[10px]">
                {queue.filter((item) => item.verifiedStatus === 'inspected').length}
              </span>
            </div>
          </nav>
        </div>

        {/* Right workspace panel */}
        <div className="flex-grow space-y-8">
          {/* Section Header */}
          <div className="border-b border-black/5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="caveman-title text-lg text-black">Verification Queue</h3>
            
            <div className="relative rounded border border-black/8 bg-black/2 focus-within:border-black/20 transition-colors w-60">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-black/35">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search index database..."
                className="w-full bg-transparent pl-8 pr-3 py-1.5 text-xs text-black placeholder-black/30 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Verification Table */}
          <div className="border border-black/8 rounded-xl overflow-hidden bg-black/2">
            {queue.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black/8 text-black/45 text-[9px] uppercase tracking-wider bg-black/1">
                      <th className="p-4 font-normal">Title</th>
                      <th className="p-4 font-normal">Address</th>
                      <th className="p-4 font-normal">Status</th>
                      <th className="p-4 font-normal">Reports</th>
                      <th className="p-4 font-normal text-right">Moderation Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((item) => (
                      <tr key={item.id} className="border-b border-black/5 hover:bg-black/2 transition-colors">
                        <td className="p-4 font-sans font-semibold text-black">
                          <Link href={`/listings/${item.id}`} className="hover:underline">
                            {item.title}
                          </Link>
                        </td>
                        <td className="p-4 text-black/70 truncate max-w-[200px]">{item.address}</td>
                        <td className="p-4">
                          {item.verifiedStatus === 'inspected' ? (
                            <span className="flex items-center gap-1 text-[9px] text-emerald-600 uppercase">
                              <CheckCircle className="w-3 h-3" />
                              <span>Inspected</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[9px] text-blue-600 uppercase">
                              <Clock className="w-3 h-3" />
                              <span>Pending</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {item.isReported ? (
                            <span className="font-bold text-amber-600 bg-amber-500/5 px-2 py-0.5 border border-amber-500/10 rounded">
                              {item.reportsCount} Reports
                            </span>
                          ) : (
                            <span className="text-black/35">0</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {item.verifiedStatus === 'pending' && (
                              <button className="px-2.5 py-1 bg-black hover:bg-black/90 text-white font-mono text-[9px] uppercase tracking-wider rounded transition-colors cursor-pointer shadow-sm">
                                Approve
                              </button>
                            )}
                            <button className="px-2.5 py-1 bg-black/5 border border-black/10 hover:bg-red-500/10 hover:border-red-500/20 text-black hover:text-red-600 font-mono text-[9px] uppercase tracking-wider rounded transition-colors cursor-pointer">
                              Flag
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-black/45 italic">No rooms loaded in moderation workspace.</div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
