export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Built on Solana Devnet</span>
          <span className="hidden sm:inline">|</span>
          <a
            href="#"
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
          <span className="hidden sm:inline">|</span>
          <a
            href="#"
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span className="hidden sm:inline">|</span>
          <a
            href="#"
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  )
}
