const items = [
  {
    id: 1,
    title: 'Peace Lily',
    price: 24,
    src: 'https://images.unsplash.com/photo-1524594227088-9b7d03da4e9f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'ZZ Plant',
    price: 32,
    src: 'https://images.unsplash.com/photo-1614594852324-9df31ff1c8b5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Snake Plant',
    price: 29,
    src: 'https://images.unsplash.com/photo-1587049352852-b0ca4b46b3d5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Pothos',
    price: 18,
    src: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Rubber Plant',
    price: 34,
    src: 'https://images.unsplash.com/photo-1582582429416-57f1a21a4837?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function Featured() {
  return (
    <div className="cards-scroll">
      {items.map((p) => (
        <article key={p.id} className="card">
          <div className="thumb">
            <img alt={p.title} src={p.src} />
            <button className="like" aria-label="Like">
              ♡
            </button>
          </div>
          <div className="card-body">
            <h3>{p.title}</h3>
            <div className="meta">
              <span>${p.price.toFixed(2)}</span>
              <button className="btn sm">Add</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
