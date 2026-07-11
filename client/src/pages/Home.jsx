import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCategories()
      .then((d) => setCategories(d.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .getProducts(activeCategory)
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const topLevel = (categories || []).filter((c) => !c.parent_id);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
            activeCategory === null
              ? 'bg-brand-900 text-paper border-brand-900'
              : 'border-brand-900/20 hover:border-brand-900'
          }`}
        >
          All
        </button>
        {topLevel.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              activeCategory === cat.id
                ? 'bg-brand-900 text-paper border-brand-900'
                : 'border-brand-900/20 hover:border-brand-900'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-brand-900/50 text-sm">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-brand-900/50 text-sm">No products yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
