export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <span className="logo">🌿</span>
          <span className="brand-name">Plantly</span>
        </div>
        <nav className="nav">
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">Catalog</a>
          <a href="#">About</a>
        </nav>
        <div className="actions">
          <button aria-label="Search" className="icon-btn">
            🔍
          </button>
          <button aria-label="Cart" className="icon-btn">
            🛒
          </button>
          <button aria-label="Account" className="icon-btn">
            👤
          </button>
        </div>
      </div>
    </header>
  );
}
