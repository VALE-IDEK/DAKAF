import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, assetUrl } from '../api/client.js';
import { useUser } from '../context/UserContext.jsx';

export default function Orders() {
  const { user, loading: userLoading } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .getMyOrders()
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, [user]);

  if (userLoading) return null;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-2">Sign in to view your orders</h1>
        <p className="text-sm text-ink/60 mb-8">Your order history is tied to your account.</p>
        <Link
          to="/login"
          className="inline-block bg-brand-900 text-paper px-6 py-2.5 rounded-md text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Your orders</h1>

      {loading ? (
        <p className="text-sm text-ink/50">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-ink/60 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="inline-block bg-brand-900 text-paper px-6 py-2.5 rounded-md text-sm font-medium hover:bg-brand-800 transition-colors"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="border border-brand-900/10 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-ink/50">
                  {new Date(order.created_at).toLocaleDateString('en-NG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-brand-900/5 text-brand-900 capitalize">
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 bg-brand-900/5 rounded-md overflow-hidden shrink-0">
                      {item.image_url ? (
                        <img
                          src={assetUrl(item.image_url)}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="flex-1 truncate">{item.product_name || 'Product removed'}</span>
                    <span className="text-ink/50">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-900/10 pt-3 flex justify-between text-sm font-medium">
                <span>Total</span>
                <span className="text-brand-900">₦{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
