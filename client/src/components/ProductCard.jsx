import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white border border-brand-900/10 rounded-lg overflow-hidden hover:border-accent-500 transition-colors"
    >
      <div className="aspect-square bg-brand-900/5 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-900/30 text-sm">
            No image
          </div>
        )}
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
