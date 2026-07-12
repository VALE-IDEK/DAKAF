const WHATSAPP_NUMBER = '2348055836568';

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-4">Contact us</h1>
      <p className="text-sm text-ink/70 leading-relaxed mb-8">
        The fastest way to reach us is WhatsApp — whether it's a question about a product, an
        order you've placed, or anything else.
      </p>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
      >
        Message us on WhatsApp
      </a>
    </div>
  );
}
