export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <p className="eyebrow">— feel the green</p>
          <h1>Happiness blooms from within</h1>
          <p className="sub">
            Bring fresh energy into your home with curated plants and pots.
          </p>
          <div className="hero-cta-buttons">
            <button className="btn primary">Shop now</button>
            <button className="btn ghost">Explore</button>
          </div>
        </div>
        <div className="hero-card">
          <div className="product-badge">Best seller</div>
          <img
            alt="Monstera plant"
            src="https://images.unsplash.com/photo-1598899134739-24b7be3c4d8a?q=80&w=1200&auto=format&fit=crop"
          />
          <div className="hero-product-meta">
            <div>
              <div className="title">Monstera Deliciosa</div>
              <div className="price">$39.00</div>
            </div>
            <button className="btn sm">Add to cart for customers </button>
          </div>
        </div>
      </div>
    </section>
  );
}
