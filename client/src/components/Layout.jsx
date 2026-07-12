import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronDown, Menu, X, User } from 'lucide-react';
import { api } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { useUser } from '../context/UserContext.jsx';

export default function Layout() {
  const [categories, setCategories] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    api.getCategories().then((d) => setCategories(d.categories || [])).catch(() => {});
  }, []);

  const topLevel = categories.filter((c) => !c.parent_id);

  function goToCategory(id) {
    setCategoriesOpen(false);
    setMobileOpen(false);
    navigate(id ? `/?category=${id}` : '/');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-900 text-paper sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-display text-2xl font-semibold tracking-tight shrink-0">
              DAKAF <span className="text-accent-500">AVAILABLES</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/" className="hover:text-accent-500 transition-colors">
                Home
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-accent-500 transition-colors">
                  Shop
                  <ChevronDown size={14} className={`transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                {categoriesOpen && (
                  <div className="absolute top-full left-0 pt-3 w-52">
                    <div className="bg-white text-ink rounded-lg shadow-lg border border-brand-900/10 py-2 overflow-hidden">
                      <button
                        onClick={() => goToCategory(null)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-brand-900/5"
                      >
                        All products
                      </button>
                      {topLevel.length === 0 ? (
                        <p className="px-4 py-2 text-xs text-ink/40">No categories yet</p>
                      ) : (
                        topLevel.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => goToCategory(cat.id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-brand-900/5"
                          >
                            {cat.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/about" className="hover:text-accent-500 transition-colors">
                About
              </Link>
              <Link to="/contact" className="hover:text-accent-500 transition-colors">
                Contact
              </Link>
              {user ? (
                <div
                  className="relative"
                  onMouseEnter={() => setAccountOpen(true)}
                  onMouseLeave={() => setAccountOpen(false)}
                >
                  <button className="flex items-center gap-2 hover:text-accent-500 transition-colors">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-6 h-6 rounded-full" />
                    ) : (
                      <User size={18} />
                    )}
                    <span className="max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {accountOpen && (
                    <div className="absolute top-full right-0 pt-3 w-44">
                      <div className="bg-white text-ink rounded-lg shadow-lg border border-brand-900/10 py-2 overflow-hidden">
                        <Link
                          to="/orders"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-brand-900/5"
                        >
                          My orders
                        </Link>
                        <button
                          onClick={() => {
                            setAccountOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-brand-900/5 text-red-600"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hover:text-accent-500 transition-colors">
                  Sign in
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative p-1.5 hover:text-accent-500 transition-colors">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-brand-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              <button
                className="md:hidden p-1.5"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden bg-brand-950 px-6 py-4 space-y-3 text-sm font-medium">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block hover:text-accent-500">
              Home
            </Link>
            <button onClick={() => goToCategory(null)} className="block hover:text-accent-500">
              All products
            </button>
            {topLevel.map((cat) => (
              <button
                key={cat.id}
                onClick={() => goToCategory(cat.id)}
                className="block pl-3 text-paper/80 hover:text-accent-500"
              >
                {cat.name}
              </button>
            ))}
            <Link to="/about" onClick={() => setMobileOpen(false)} className="block hover:text-accent-500">
              About
            </Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block hover:text-accent-500">
              Contact
            </Link>
            {user ? (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="block hover:text-accent-500">
                  My orders ({user.name?.split(' ')[0]})
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="block text-red-400 hover:text-red-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block hover:text-accent-500">
                Sign in
              </Link>
            )}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-brand-950 text-paper/60 text-xs py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} DAKAF AVAILABLES</span>
          <div className="flex items-center gap-5">
            <Link to="/about" className="hover:text-accent-500 transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-accent-500 transition-colors">
              Contact
            </Link>
            <Link to="/admin/login" className="hover:text-accent-500 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
