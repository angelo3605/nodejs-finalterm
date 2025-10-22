export default function Banner() {
  return (
    <section className="promo">
      <div className="container promo-inner">
        <div className="promo-text">
          <h3>Free Shipping Services</h3>
          <p>Orders over $50 ship free nationwide. Fresh plants guaranteed.</p>
          <button className="btn">Learn more</button>
        </div>
        <img
          className="promo-img"
          alt="Decor with vases"
          src="https://images.unsplash.com/photo-1549849171-07ea0e5b5a2a?q=80&w=1200&auto=format&fit=crop"
        />
      </div>
    </section>
  );
}
