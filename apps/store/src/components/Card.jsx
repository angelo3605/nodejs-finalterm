import { FaCheck, FaRegComment, FaRegStar, FaRegStarHalfStroke, FaSpinner, FaStar } from "react-icons/fa6";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { Image } from "@/components/Image";
import { useNavigate } from "react-router";
import confetti from "canvas-confetti";
import { Fragment, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";

export function Card({ product }) {
  const minPrice = product?.variants.reduce((min, variant) => (min < variant.price ? variant.price : min), 0);
  const minPriceStr = product?.variants.length ? longCurrencyFormatter.format(minPrice) : "Not for sale";

  const totalStars = product?.ratings?.reduce((sum, rating) => sum + rating.stars, 0) ?? 0;
  const avgStars = totalStars / (product?.ratings?.length ?? 1);

  const [addedToCart, setAddedToCart] = useState(false);

  const navigate = useNavigate();
  const ref = useRef(null);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ variantId, amount }) =>
      api.post("/cart", {
        variantId,
        amount,
      }),
    onSuccess: () =>
      queryClient
        .invalidateQueries({
          queryKey: ["cart"],
        })
        .then(() => {
          setAddedToCart(true);
          fireConfetti();
          setTimeout(() => setAddedToCart(false), 2000);
        }),
  });

  const fireConfetti = () => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    confetti({
      particleCount: 20,
      spread: 360,
      ticks: 80,
      gravity: -0.2,
      decay: 0.8,
      shapes: ["star"],
      startVelocity: 20,
      scalar: 1.2,
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
      origin: {
        x: (left + width / 2) / window.innerWidth,
        y: (top + height / 2) / window.innerHeight,
      },
    });
  };

  const handleClick = (e, product) => {
    e.stopPropagation();
    const variant = product.variants.find((variant) => variant.stockQuantity);
    mutate({
      variantId: variant.id,
      amount: 1,
    });
  };

  return (
    <div
      className="relative w-[300px] rounded-lg shadow-lg bg-white text-black dark:bg-gray-800 dark:text-white cursor-pointer hover:-translate-y-1 transition"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <Image src={product?.imageUrls?.[0]} className="aspect-video w-full rounded-tl-lg rounded-tr-lg" />
      <div className="text-start p-4">
        <div className="grid grid-cols-[1fr_auto] mb-2">
          {product ? (
            <>
              <span className="text-sm">{product.category?.name ?? "Other"}</span>
              <span className="row-span-2 font-medium text-emerald-800 dark:text-emerald-400">{minPriceStr}</span>
              <span className="font-bold">{product.name}</span>
            </>
          ) : (
            <>
              <div className="placeholder w-20 h-3!"></div>
              <div className="placeholder w-20"></div>
              <div className="placeholder w-40 mt-3"></div>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5 text-yellow-600 dark:text-yellow-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Fragment key={i}>{i <= avgStars ? <FaStar /> : i - 0.5 === avgStars ? <FaRegStarHalfStroke /> : <FaRegStar />}</Fragment>
            ))}
          </div>
          <span className="text-sm ml-1">{product ? `(${product?.ratings.length ?? 0})` : <div className="placeholder w-6"></div>}</span>
          <span className="flex items-center gap-2 text-sm ml-auto">
            <FaRegComment className="text-sky-600 dark:text-sky-400" /> {product ? (product?.comments.length ?? 0) : <div className="placeholder w-6"></div>}
          </span>
        </div>
        <button ref={ref} className="btn btn-secondary h-9! w-full mt-4" onClick={(e) => handleClick(e, product)} disabled={isPending || !product}>
          {addedToCart ? (
            <>
              <FaCheck /> Added to cart
            </>
          ) : (
            <>{isPending && <FaSpinner className="animate-spin" />} Add to cart</>
          )}
        </button>
      </div>
      {product?.isFeatured && (
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
