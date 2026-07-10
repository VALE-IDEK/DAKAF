import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client.js';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getProduct(id)
      .then((d) => setProduct(d.product))
      .catch(() => setError('Product not found.'));
  }, [id]);

  if (error) return <p className="max-w-6xl mx-auto px-6 py-10 text-sm">{error}</p>;
  if (!product) return <p className="max-w-6xl mx-auto px-6 py-10 text-sm">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-brand-900/5 rounded-lg overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-900/30 text-sm">
            No image
          </div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="font-display text-3xl text-brand-900 mt-3">
          ₦{Number(product.price).toLocaleString()}
        </p>
        <p className="text-sm text-ink/70 mt-4 leading-relaxed">{product.description}</p>
        <p className="text-xs text-ink/40 mt-6">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
        <button className="mt-6 bg-brand-900 text-paper px-6 py-2.5 rounded-md text-sm font-medium hover:bg-brand-800 transition-colors">
          Add to cart
        </button>
      </div>
    </div>
  );
}
