import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useUser } from '../context/UserContext.jsx';
import { api, assetUrl } from '../api/client.js';

const WHATSAPP_NUMBER = '2348055836568'; // 08055836568 in international format, no leading 0

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useUser();

  function buildWhatsAppMessage() {
    const lines = items.map(
      (i) => `• ${i.name} — Qty: ${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`
    );
    const message = [
      'Hi DAKAF AVAILABLES, I would like to order:',
      '',
      ...lines,
      '',
      `Total: ₦${totalPrice.toLocaleString()}`,
    ].join('\n');
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  async function handleCheckout() {
    // If signed in, save the order to their account so it shows up in order
    // history. If this fails or they're not signed in, still let checkout
    // proceed via WhatsApp - saving the order is a bonus, not a blocker.
    if (user) {
      try {
        await api.createOrder({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price })),
          total: totalPrice,
        });
      } catch {
        // ignore - WhatsApp checkout still proceeds below
      }
    }
    window.open(buildWhatsAppMessage(), '_blank', 'noopener,noreferrer');
    clearCart();
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-sm text-ink/60 mb-8">Add a few things you like and they'll show up here.</p>
        <Link
          to="/"
          className="inline-block bg-brand-900 text-paper px-6 py-2.5 rounded-md text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Your cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border border-brand-900/10 rounded-lg p-4"
          >
            <div className="w-16 h-16 bg-brand-900/5 rounded-md overflow-hidden shrink-0">
              {item.image_url ? (
                <img
                  src={assetUrl(item.image_url)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-sm text-brand-900">₦{Number(item.price).toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-2 border border-brand-900/20 rounded-md">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1.5 hover:bg-brand-900/5"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1.5 hover:bg-brand-900/5"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-brand-900/10 pt-6 flex items-center justify-between mb-6">
        <span className="text-sm text-ink/60">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        <span className="text-xl font-display text-brand-900">₦{totalPrice.toLocaleString()}</span>
      </div>

      <button
        onClick={handleCheckout}
        className="block w-full text-center bg-green-600 text-white py-3 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
      >
        Checkout via WhatsApp
      </button>
      <p className="text-xs text-ink/40 text-center mt-3">
        {user
          ? 'This saves the order to your account and opens WhatsApp — just hit send.'
          : 'This opens WhatsApp with your order details filled in — just hit send.'}
      </p>
    </div>
  );
}
