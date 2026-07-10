import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-900 text-paper">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
            DAKAF <span className="text-accent-500">AVAILABLES</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-accent-500 transition-colors">
              Shop
            </Link>
            <Link to="/login" className="hover:text-accent-500 transition-colors">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-brand-950 text-paper/60 text-xs py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} DAKAF AVAILABLES</span>
          <Link to="/admin/login" className="hover:text-accent-500 transition-colors">
            Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
