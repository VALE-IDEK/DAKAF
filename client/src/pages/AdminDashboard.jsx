import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('');

  // Category form
  const [catName, setCatName] = useState('');
  const [catParent, setCatParent] = useState('');

  // Product form
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pStock, setPStock] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pImage, setPImage] = useState(null);

  useEffect(() => {
    const t = sessionStorage.getItem('admin_token');
    if (!t) {
      navigate('/admin/login');
      return;
    }
    setToken(t);
  }, [navigate]);

  useEffect(() => {
    refreshData();
  }, []);

  function refreshData() {
    api.getCategories().then((d) => setCategories(d.categories));
    api.getProducts().then((d) => setProducts(d.products));
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    setStatus('');
    try {
      await api.adminCreateCategory(token, {
        name: catName,
        parent_id: catParent || null,
      });
      setCatName('');
      setCatParent('');
      refreshData();
      setStatus('Category added.');
    } catch (err) {
      setStatus(err.message);
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setStatus('');
    try {
      const formData = new FormData();
      formData.append('name', pName);
      formData.append('description', pDesc);
      formData.append('price', pPrice);
      formData.append('stock', pStock);
      if (pCategory) formData.append('category_id', pCategory);
      if (pImage) formData.append('image', pImage);

      await api.adminCreateProduct(token, formData);
      setPName('');
      setPDesc('');
      setPPrice('');
      setPStock('');
      setPCategory('');
      setPImage(null);
      refreshData();
      setStatus('Product added.');
    } catch (err) {
      setStatus(err.message);
    }
  }

  async function handleDeleteCategory(id) {
    if (!confirm('Delete this category? Products in it will become uncategorized.')) return;
    await api.adminDeleteCategory(token, id);
    refreshData();
  }

  async function handleDeleteProduct(id) {
    await api.adminDeleteProduct(token, id);
    refreshData();
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_token');
    navigate('/admin/login');
  }

  if (!token) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
        <button onClick={handleLogout} className="text-sm underline text-ink/60 hover:text-ink">
          Log out
        </button>
      </div>

      {status && <p className="text-sm mb-6 text-brand-900">{status}</p>}

      <div className="grid md:grid-cols-2 gap-10">
        {/* Categories */}
        <section>
          <h2 className="font-medium mb-3">Add category</h2>
          <form onSubmit={handleAddCategory} className="space-y-3 mb-6">
            <input
              placeholder="Category name"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="w-full border border-brand-900/20 rounded-md px-3 py-2 text-sm"
              required
            />
            <select
              value={catParent}
              onChange={(e) => setCatParent(e.target.value)}
              className="w-full border border-brand-900/20 rounded-md px-3 py-2 text-sm"
            >
              <option value="">No parent (top-level category)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button className="bg-brand-900 text-paper rounded-md px-4 py-2 text-sm font-medium hover:bg-brand-800 transition-colors">
              Add category
            </button>
          </form>

          <h3 className="text-xs font-medium text-ink/50 mb-2">Existing categories</h3>
          <ul className="text-sm space-y-1">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between border-b border-brand-900/10 pb-1">
                <span className="text-ink/70">
                  {c.parent_id ? '— ' : ''}
                  {c.name}
                </span>
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Products */}
        <section>
          <h2 className="font-medium mb-3">Add product</h2>
          <form onSubmit={handleAddProduct} className="space-y-3">
            <input
              placeholder="Product name"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              className="w-full border border-brand-900/20 rounded-md px-3 py-2 text-sm"
              required
            />
            <textarea
              placeholder="Description"
              value={pDesc}
              onChange={(e) => setPDesc(e.target.value)}
              className="w-full border border-brand-900/20 rounded-md px-3 py-2 text-sm"
              rows={3}
            />
            <div className="flex gap-3">
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={pPrice}
                onChange={(e) => setPPrice(e.target.value)}
                className="w-full border border-brand-900/20 rounded-md px-3 py-2 text-sm"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={pStock}
                onChange={(e) => setPStock(e.target.value)}
                className="w-full border border-brand-900/20 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <select
              value={pCategory}
              onChange={(e) => setPCategory(e.target.value)}
              className="w-full border border-brand-900/20 rounded-md px-3 py-2 text-sm"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPImage(e.target.files[0])}
              className="w-full text-sm"
            />
            <button className="bg-brand-900 text-paper rounded-md px-4 py-2 text-sm font-medium hover:bg-brand-800 transition-colors">
              Add product
            </button>
          </form>

          <h3 className="text-xs font-medium text-ink/50 mt-6 mb-2">Existing products</h3>
          <ul className="text-sm space-y-2">
            {products.map((p) => (
              <li key={p.id} className="flex items-center justify-between border-b border-brand-900/10 pb-1">
                <span>
                  {p.name} — ₦{Number(p.price).toLocaleString()}
                </span>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
