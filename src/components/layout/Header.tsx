export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-neutral-200/50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="font-bold text-neutral-800">Oracle Ranger</h1>
              <p className="text-xs text-neutral-600 hidden sm:block">ชาวสวนตัวจริง</p>
            </div>
          </a>
          
          {/* Navigation */}
          <nav className="flex items-center gap-4 md:gap-6">
            <a 
              href="/" 
              className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors"
            >
              Home
            </a>
            <a 
              href="/dashboard" 
              className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors"
            >
              Dashboard
            </a>
          </nav>
          
        </div>
      </div>
    </header>
  );
}
