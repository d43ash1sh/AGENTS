import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-zinc-500 text-xs sm:text-sm mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & copyright */}
          <div className="flex items-center gap-4">
            <Logo iconSize={24} showText={true} className="opacity-80" />
            <span className="hidden sm:inline border-l border-zinc-800 h-4" />
            <span>&copy; {new Date().getFullYear()} RoomNearRGU. All rights reserved.</span>
          </div>
          
          {/* Attribution */}
          <div className="flex items-center gap-1.5" aria-label="Developer attribution">
            <span>Made with ❤️ by</span>
            <a
              href="https://d43ash1sh.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-zinc-300 hover:text-white hover:underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 rounded-md px-1 cursor-pointer"
              aria-label="Visit Debashish's portfolio website (opens in a new tab)"
            >
              Debashish
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}
