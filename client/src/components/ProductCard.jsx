import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { assetUrl } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white border border-brand-900/10 rounded-lg overflow-hidden hover:border-accent-500 transition-colors"
    >
      <div className="aspect-square bg-brand-900/5 overflow-hidden relative">
        {product.image_url ? (
          <img
            src={assetUrl(product.image_url)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-900/30 text-sm">
            No image
          </div>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 bg-brand-900 text-paper p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent-500"
          aria-label="Add to cart"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <p className="font-display text-lg text-brand-900 mt-1">
          ₦{Number(product.price).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
