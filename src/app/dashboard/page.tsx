import { getUser } from '@/lib/services/auth'
import { getListings } from '@/lib/services/listings'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PhoneCall, MousePointerClick, Eye, Bookmark, TrendingUp } from 'lucide-react'

export const revalidate = 0

export default async function OwnerDashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all room listings and filter for current owner
  const allListings = await getListings({ status: 'all' })
  const ownerListings = allListings.filter((l) => l.owner_id === user.id)

  // Sum or average mock/real telemetry
  const totalListings = ownerListings.length
  
  // Calculate mock stats deterministically based on listing IDs so they stay stable
  const stats = ownerListings.map((l) => {
    const seed = l.title.charCodeAt(0) + l.title.charCodeAt(l.title.length - 1)
    const views = Math.floor((seed * 3.5) % 450) + 120
    const clicks = Math.floor((views * 0.35)) + 15
    const calls = Math.floor((clicks * 0.18)) + 3
    const bookmarks = Math.floor((clicks * 0.22)) + 5
    const convRate = ((calls / views) * 100).toFixed(1)
    
    return {
      id: l.id,
      title: l.title,
      views,
      clicks,
      calls,
      bookmarks,
      convRate
    }
  })

  const totalViews = stats.reduce((acc, curr) => acc + curr.views, 0)
  const totalClicks = stats.reduce((acc, curr) => acc + curr.clicks, 0)
  const totalCalls = stats.reduce((acc, curr) => acc + curr.calls, 0)
  const totalBookmarks = stats.reduce((acc, curr) => acc + curr.bookmarks, 0)
  const avgConvRate = totalViews > 0 ? ((totalCalls / totalViews) * 100).toFixed(1) : '0.0'

  return (
    <div className="bg-[#ffffff] min-h-screen text-black py-12 relative w-full pt-20">
      
      {/* Background glow decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[10%] w-[35%] h-[35%] rounded-full bg-blue-500/5 blur-[160px] radial-glow" />
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-12 z-10 relative space-y-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/5">
          <div className="space-y-1">
            <span className="caveman-label text-[9px] block">Owner Telemetry</span>
            <h1 className="caveman-title text-2xl sm:text-3xl text-black">Performance Analytics</h1>
          </div>
          <Link
            href="/listings/new"
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-black hover:bg-black/90 text-white font-mono text-[10px] uppercase tracking-wider rounded transition-all active:scale-[0.98] w-fit shadow-md shadow-black/10"
          >
            <span>List Property</span>
          </Link>
        </div>

        {totalListings === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center border border-black/8 rounded-xl bg-black/2 max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="caveman-title text-xl text-black">No Telemetry Stream Detected</h2>
              <p className="text-xs text-black/55 max-w-sm mx-auto leading-relaxed">
                You do not have any room listings. Post a room near Rajiv Gandhi University to start receiving views, calls, and performance tracking analytics.
              </p>
            </div>
            <Link
              href="/listings/new"
              className="px-6 py-3 bg-black hover:bg-black/90 text-white font-mono text-xs uppercase tracking-wider rounded transition-all active:scale-[0.98] shadow-md shadow-black/10"
            >
              Post Your First Room
            </Link>
          </div>
        ) : (
          /* Analytics Workspace */
          <div className="space-y-8">
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-black/2 border border-black/8 p-5 rounded-lg">
                <div className="flex items-center justify-between text-black/45">
                  <span className="font-mono text-[9px] uppercase tracking-wider">Impressions</span>
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <p className="font-mono text-2xl font-bold mt-2">{totalViews}</p>
                <span className="font-mono text-[8px] text-black/35 mt-1 block">Telemetry Views</span>
              </div>

              <div className="bg-black/2 border border-black/8 p-5 rounded-lg">
                <div className="flex items-center justify-between text-black/45">
                  <span className="font-mono text-[9px] uppercase tracking-wider">Interactions</span>
                  <MousePointerClick className="w-3.5 h-3.5" />
                </div>
                <p className="font-mono text-2xl font-bold mt-2">{totalClicks}</p>
                <span className="font-mono text-[8px] text-black/35 mt-1 block">Detail Clicks</span>
              </div>

              <div className="bg-black/2 border border-black/8 p-5 rounded-lg">
                <div className="flex items-center justify-between text-black/45">
                  <span className="font-mono text-[9px] uppercase tracking-wider">Direct Calls</span>
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
                <p className="font-mono text-2xl font-bold mt-2">{totalCalls}</p>
                <span className="font-mono text-[8px] text-black/35 mt-1 block">Contact clicks</span>
              </div>

              <div className="bg-black/2 border border-black/8 p-5 rounded-lg">
                <div className="flex items-center justify-between text-black/45">
                  <span className="font-mono text-[9px] uppercase tracking-wider">Bookmarks</span>
                  <Bookmark className="w-3.5 h-3.5" />
                </div>
                <p className="font-mono text-2xl font-bold mt-2">{totalBookmarks}</p>
                <span className="font-mono text-[8px] text-black/35 mt-1 block">Saved by students</span>
              </div>

              <div className="col-span-2 lg:col-span-1 bg-black/2 border border-black/8 p-5 rounded-lg">
                <div className="flex items-center justify-between text-black/45">
                  <span className="font-mono text-[9px] uppercase tracking-wider">Conversion</span>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <p className="font-mono text-2xl font-bold mt-2">{avgConvRate}%</p>
                <span className="font-mono text-[8px] text-black/35 mt-1 block">Impression to Call</span>
              </div>
            </div>

            {/* Custom SVG Line Chart representation */}
            <div className="bg-black/2 border border-black/8 p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-black/45">Historical Analytics</span>
                  <h3 className="caveman-title text-sm text-black">Daily Traffic Flow</h3>
                </div>
                <span className="font-mono text-[9px] text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase">
                  +12.4% vs last week
                </span>
              </div>

              {/* Graphic Chart representation */}
              <div className="h-48 w-full pt-4 relative select-none">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="5" x2="100" y2="5" stroke="rgba(0,0,0,0.03)" strokeWidth="0.1" />
                  <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(0,0,0,0.03)" strokeWidth="0.1" />
                  <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(0,0,0,0.03)" strokeWidth="0.1" />
                  
                  {/* Glowing Gradient fill */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  <path
                    d="M0 20 Q 15 12, 30 14 T 60 7 T 90 9 T 100 8 L 100 20 Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Telemetry Line */}
                  <path
                    d="M0 20 Q 15 12, 30 14 T 60 7 T 90 9 T 100 8"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="0.4"
                    strokeLinecap="round"
                  />
                  
                  {/* Pulse indicator at latest node */}
                  <circle cx="100" cy="8" r="0.6" fill="#3b82f6" />
                  <circle cx="100" cy="8" r="1.5" fill="none" stroke="#3b82f6" strokeWidth="0.2" className="animate-ping" />
                </svg>

                {/* Timeline axis */}
                <div className="flex justify-between font-mono text-[8px] text-black/45 pt-2 border-t border-black/5">
                  <span>JULY 04</span>
                  <span>JULY 06</span>
                  <span>JULY 08</span>
                  <span>JULY 10 (TODAY)</span>
                </div>
              </div>
            </div>

            {/* Detailed Listings Table list */}
            <div className="space-y-4">
              <span className="caveman-label text-[9px] block">Rooms Analytics Breakdown</span>
              <div className="border border-black/8 rounded-xl overflow-hidden bg-black/2">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black/8 text-black/45 text-[9px] uppercase tracking-wider bg-black/1">
                      <th className="p-4 font-normal">Listing Title</th>
                      <th className="p-4 font-normal text-right">Views</th>
                      <th className="p-4 font-normal text-right">Clicks</th>
                      <th className="p-4 font-normal text-right">Calls</th>
                      <th className="p-4 font-normal text-right">Bookmarks</th>
                      <th className="p-4 font-normal text-right">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((s) => (
                      <tr key={s.id} className="border-b border-black/5 hover:bg-black/2 transition-colors">
                        <td className="p-4 font-sans font-semibold text-black">
                          <Link href={`/listings/${s.id}`} className="hover:underline">
                            {s.title}
                          </Link>
                        </td>
                        <td className="p-4 text-right text-black/70">{s.views}</td>
                        <td className="p-4 text-right text-black/70">{s.clicks}</td>
                        <td className="p-4 text-right text-black/70">{s.calls}</td>
                        <td className="p-4 text-right text-black/70">{s.bookmarks}</td>
                        <td className="p-4 text-right font-bold text-black">{s.convRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
