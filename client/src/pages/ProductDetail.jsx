import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, assetUrl } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    api
      .getProduct(id)
      .then((d) => setProduct(d.product))
      .catch(() => setError('Product not found.'));
  }, [id]);

  function handleAddToCart() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (error) return <p className="max-w-6xl mx-auto px-6 py-10 text-sm">{error}</p>;
  if (!product) return <p className="max-w-6xl mx-auto px-6 py-10 text-sm">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-brand-900/5 rounded-lg overflow-hidden">
        {product.image_url ? (
          <img src={assetUrl(product.image_url)} alt={product.name} className="w-full h-full object-cover" />
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

        <div className="flex items-center gap-3 mt-6">
          <div className="flex items-center border border-brand-900/20 rounded-md">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-2 hover:bg-brand-900/5 text-sm"
            >
              −
            </button>
            <span className="w-10 text-center text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-2 hover:bg-brand-900/5 text-sm"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-brand-900 text-paper px-6 py-2.5 rounded-md text-sm font-medium hover:bg-brand-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {added ? 'Added ✓' : 'Add to cart'}
          </button>
          <button
            onClick={() => {
              handleAddToCart();
              navigate('/cart');
            }}
            disabled={product.stock === 0}
            className="flex-1 border border-brand-900 text-brand-900 px-6 py-2.5 rounded-md text-sm font-medium hover:bg-brand-900/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
