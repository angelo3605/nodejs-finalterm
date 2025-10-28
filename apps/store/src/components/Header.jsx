import { Link } from "react-router";
import { FaMagnifyingGlass, FaCartShopping, FaUser } from "react-icons/fa6";

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span className="logo">🌿</span>
          <span className="brand-name">Plantly</span>
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/all">Catalog</Link>
          <Link to="/about">About</Link>
        </nav>
        <div
          className="
            flex items-center gap-2
            *:flex *:justify-center *:items-center
            *:aspect-square *:h-11
            *:border *:border-white/20 *:rounded-lg
            [&>*:hover]:-translate-y-1 *:transition
            *:cursor-pointer
          "
        >
          <button aria-label="Search">
            <FaMagnifyingGlass className="size-5" />
          </button>
          <button aria-label="Cart">
            <FaCartShopping className="size-5" />
          </button>
          <button aria-label="Account">
            <FaUser className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
