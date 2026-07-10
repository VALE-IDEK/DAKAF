import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { token } = await api.adminLogin(username, password);
      sessionStorage.setItem('admin_token', token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="text-2xl font-semibold mb-6">Admin login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-ink/60 mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-brand-900/20 rounded-md px-3 py-2 text-sm"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink/60 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-brand-900/20 rounded-md px-3 py-2 text-sm"
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="text-red-600 text-xs">{error}</p>}
        <button
          type="submit"
          className="w-full bg-brand-900 text-paper rounded-md py-2.5 text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
