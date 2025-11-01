import { FaRegComment, FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { Image } from "@/components/Image";
import { useNavigate } from "react-router";

export function Card({ product }) {
  const minPrice = Math.min(...product.variants.map(({ price }) => price));
  const avgStars = product.ratings?.map((rating) => rating.stars) ?? 0;

  const navigate = useNavigate();

  return (
    <div className="relative w-[300px] rounded-lg shadow-lg bg-white text-black cursor-pointer hover:-translate-y-1 transition" onClick={() => navigate(`/product/${product.slug}`)}>
      <Image src={product.imageUrls[0]} className="aspect-video w-full rounded-tl-lg rounded-tr-lg" />
      <div className="text-start p-4">
        <div className="grid grid-cols-[1fr_auto] mb-2">
          <span className="text-sm">{product.category?.name ?? "Other"}</span>
          <span className="row-span-2 font-medium text-emerald-800">{Number.isFinite(minPrice) ? longCurrencyFormatter.format(minPrice) : "Not for sale"}</span>
          <span className="font-bold">{product.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((i) => (i <= avgStars ? <FaStar /> : i - 0.5 === avgStars ? <FaRegStarHalfStroke /> : <FaRegStar />))}</div>
          <span className="text-sm ml-1">({product.ratings?.length ?? 0})</span>
          <span className="flex items-center gap-2 text-sm ml-auto">
            <FaRegComment /> {product.comments?.length ?? 0}
          </span>
        </div>
        <button
          className="btn btn-secondary h-9! w-full mt-4"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Add to cart
        </button>
      </div>
      {product.isFeatured && (
        <span
          className="
          flex items-center gap-2 absolute -top-2 left-4 px-2 py-1
          bg-emerald-800 text-white font-bold text-sm rounded-bl-lg rounded-br-lg shadow-md/20
          after:content-[''] after:block after:absolute after:-left-1 after:top-0 after:-translate-x-1/3 after:scale-x-75
          after:border-8 after:border-t-0 after:border-r-0 after:border-transparent after:border-b-emerald-950
        "
        >
          <FaStar /> Featured
        </span>
      )}
    </div>
  );
}
