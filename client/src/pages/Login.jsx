import { Link } from 'react-router-dom';

// Hardcoded directly since the Vercel env var wasn't reliably making it into
// the build. If you ever move the backend, update this one line.
const API_ROOT = 'https://dakaf-api.onrender.com';

export default function Login() {
  return (
    <div className="max-w-sm mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
      <p className="text-sm text-ink/60 mb-8">Sign in with your Google account to continue.</p>

      <a
        href={`${API_ROOT}/api/auth/google`}
        className="w-full flex items-center justify-center gap-3 border border-brand-900/20 rounded-md py-2.5 text-sm font-medium hover:border-brand-900 transition-colors"
      >
        Continue with Google
      </a>

      <p className="text-xs text-ink/40 mt-10">
        Are you an admin?{' '}
        <Link to="/admin/login" className="underline hover:text-brand-900">
          Admin login
        </Link>
      </p>
    </div>
  );
}
