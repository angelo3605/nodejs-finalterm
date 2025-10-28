export function Card({ product }) {
  const minPrice = Math.min(...product.variants.map(({ price }) => price));

  return (
    <button className="w-[300px]" onClick={() => {}}>
      <img src={product.imageUrls[0]} className="aspect-6/7 rounded-lg shadow-lg/10 w-full object-cover" />
      <div className="text-start py-4">
        <div className="flex items-center justify-between gap-2 text-xl">
          <span className="text-emerald-700 font-bold">{product.name}</span>
          {Number.isFinite(minPrice) ? minPrice : ""} VND
        </div>
        <span className="opacity-75">
          {product.category.name} / {product.brand.name}
        </span>
      </div>
    </button>
  );
}
