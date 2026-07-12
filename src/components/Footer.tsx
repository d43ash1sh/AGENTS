import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#fafafa] py-8 text-black/35 text-[10px] font-mono uppercase tracking-wider mt-auto z-10 relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & copyright */}
          <div className="flex items-center gap-4">
            <Logo iconSize={14} showText={true} className="opacity-75" />
            <span className="hidden sm:inline border-l border-black/5 h-4" />
            <span>&copy; {new Date().getFullYear()} NestRGU.</span>
          </div>
          
          {/* Attribution */}
          <div className="flex items-center gap-1.5" aria-label="Developer attribution">
            <span>By</span>
            <a
              href="https://d43ash1sh.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-black/60 hover:text-black transition-colors"
            >
              Debashish
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}
