import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { api } from "@mint-boutique/axios-client";
import { formatDistanceToNow } from "date-fns";
import { FaArrowsLeftRight, FaArrowsUpDown, FaBagShopping, FaCheck, FaImages, FaPaperPlane, FaRegStar, FaRuler, FaSpinner, FaStar, FaTrash, FaWeightHanging } from "react-icons/fa6";
import { io } from "socket.io-client";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { commentSchema, ratingSchema } from "@mint-boutique/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import toast from "react-hot-toast";
import { handleError } from "@/utils/errorHandler";
import confetti from "canvas-confetti";
import { FaEnvelope } from "react-icons/fa";
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Image } from "@/components/Image";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { longCurrencyFormatter } from "@mint-boutique/formatters";

const commentSocket = io(`${import.meta.env.VITE_API_URL}/comments`);
const ratingSocket = io(`${import.meta.env.VITE_API_URL}/ratings`);

const fireConfetti = () => {
  confetti({
    particleCount: 100,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
  });
  confetti({
    particleCount: 100,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
  });
};

function TitleDivider({ title }) {
  return (
    <div className="flex items-center gap-4 font-bold">
      <h5>{title}</h5>
      <hr className="flex-1 border-gray-300 dark:border-gray-700" />
    </div>
  );
}

function Comment({ comment }) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.delete(`/comments/${comment.id}`),
    onSuccess: () => toast.success("Comment has been deleted"),
    onError: handleError,
  });

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
      <div className="flex items-center gap-4">
        <div className="shrink-0 flex justify-center items-center size-10 rounded-full font-bold bg-sky-200 text-sky-800 dark:bg-sky-700 dark:text-sky-100">{comment.senderName[0]}</div>
        <div className="*:block *:leading-none space-y-1.5 w-full">
          <span className="font-bold">{comment.senderName}</span>
          <span className="text-sm">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <button className="btn hover:bg-black/10" disabled={isPending} onClick={() => mutate()}>
          {isPending ? <FaSpinner className="animate-spin" /> : <FaTrash />} Delete
        </button>
      </div>
      <p>{comment.message}</p>
    </div>
  );
}

function CommentForm({ parentId, disabled }) {
  const { slug } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(
      commentSchema.pick({
        message: true,
      }),
    ),
    defaultValues: {
      message: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ message, parentId }) =>
      api.post(`/products/${slug}/comments`, {
        message,
        parentId,
      }),
    onSuccess: () => {
      reset();
      toast.success("Comment has been posted!");
    },
    onError: handleError,
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        mutate({
          message: values.message,
          parentId,
        }),
      )}
    >
      <div className="flex items-end gap-2">
        <label className="floating-label w-full">
          <input {...register("message")} placeholder="" className="floating-label__input" disabled={disabled} />
          <span className={clsx("floating-label__label", parentId && "bg-gray-100! dark:bg-gray-800!")}>{parentId ? "Reply" : "Comment"}</span>
        </label>
        <button type="submit" className="btn btn-primary h-12!" disabled={isPending || disabled}>
          {isPending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
        </button>
      </div>
      {errors.message && <p className="text-red-500">{errors.message.message}</p>}
    </form>
  );
}

function RatingForm() {
  const { slug } = useParams();

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      stars: 0,
      review: "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ stars, review }) =>
      api.post(`/products/${slug}/ratings`, {
        stars,
        review,
      }),
    onSuccess: (data) => {
      reset();
      if (data.data.data.stars === 5) {
        fireConfetti();
        toast.success("You are awesome :D");
      } else {
        toast.success("Thank you for rating out product!");
      }
    },
    onError: handleError,
  });

  const stars = watch("stars") || 0;

  const sortByDate = (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt);

  useEffect(() => {
    ratingSocket.emit("join", slug);

    ratingSocket.on("rating:new", (newRating) => {
      queryClient.setQueryData(["products", slug], (old) => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          ratings: [newRating].concat(old.ratings?.filter((rating) => rating.id !== newRating.id) ?? []).sort(sortByDate),
        };
      });
    });

    return () => {
      ratingSocket.emit("leave", slug);
      ratingSocket.off("rating:new");
    };
  }, [slug, queryClient]);

  return (
    <form className="w-[300px] h-[300px] flex flex-col gap-2" onSubmit={handleSubmit((values) => mutate(values))}>
      <div className="flex justify-between items-center gap-2">
        <span className="opacity-75">Tap to Rate</span>
        <div className="flex">
          {Array.from({ length: 5 }, (_, i) => {
            const s = i + 1;
            return (
              <button
                type="button"
                key={i}
                onClick={() => setValue("stars", s)}
                className="*:box-content *:size-7 *:p-0.5 text-yellow-600 dark:text-yellow-500 [&>:hover]:brightness-125 *:cursor-pointer"
              >
                {i < stars ? <FaStar /> : <FaRegStar />}
              </button>
            );
          })}
        </div>
      </div>
      <label className="floating-label h-full">
        <textarea {...register("review")} placeholder="" className="floating-label__input resize-none h-full" />
        <span className="floating-label__label">Review</span>
      </label>
      <button className="btn btn-primary w-full mt-2 min-h-9" disabled={isPending}>
        {isPending && <FaSpinner className="animate-spin" />} Submit
      </button>
    </form>
  );
}

function Rating({ rating }) {
  return (
    <div className="w-[300px] min-h-[300px] h-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
      <div className="flex justify-between gap-2">
        <div className="flex gap-1 *:size-5 text-yellow-600 dark:text-yellow-500">
          {Array.from({ length: 5 }, (_, i) => (
            <Fragment key={i}>{i + 1 <= rating?.stars ? <FaStar /> : <FaRegStar />}</Fragment>
          ))}
        </div>
        <div className="flex flex-col items-end *:leading-none gap-1">
          {rating ? (
            <>
              <span className="font-bold">{rating.user.fullName}</span>
              <span className="text-sm">
                {formatDistanceToNow(new Date(rating.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </>
          ) : (
            <>
              <div className="placeholder w-10"></div>
              <div className="placeholder w-20 !h-3 mt-1"></div>
            </>
          )}
        </div>
      </div>
      {rating ? <p>{rating.review}</p> : <div className="placeholder w-full"></div>}
    </div>
  );
}

export default function Product() {
  const { slug } = useParams();

  const queryClient = useQueryClient();

  const [activeVariant, setActiveVariant] = useState(null);

  const { data: product, isPending: isProductLoading } = useQuery({
    queryKey: ["products", slug],
    queryFn: () => api.get(`/products/${slug}`).then((res) => res.data?.data),
  });

  useEffect(() => {
    if (product?.variants.length) {
      setActiveVariant(product.variants.find((variant) => variant.stockQuantity));
    }
  }, [product]);

  const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

  useEffect(() => {
    commentSocket.emit("join", slug);

    commentSocket.on("comment:new", (newComment) => {
      queryClient.setQueryData(["products", slug], (old) => {
        if (!old) {
          return old;
        }
        if (newComment.parentId) {
          const newComments = old.comments?.map((comment) => {
            if (comment.id === newComment.parentId) {
              return {
                ...comment,
                replies: [newComment].concat(comment.replies ?? []).sort(sortByDate),
              };
            }
            return { ...comment };
          });
          return {
            ...old,
            comments: (newComments ?? []).sort(sortByDate),
          };
        }
        return {
          ...old,
          comments: [newComment].concat(old.comments ?? []).sort(sortByDate),
        };
      });
    });

    commentSocket.on("comment:delete", (deletedComment) => {
      queryClient.setQueryData(["products", slug], (old) => {
        if (!old) {
          return old;
        }
        const newComments = old.comments
          ?.filter((comment) => comment.id !== deletedComment.id)
          ?.map((comment) => {
            const newReplies = comment.replies?.filter((reply) => reply.id !== deletedComment.id);
            return {
              ...comment,
              replies: newReplies ?? [],
            };
          });
        return {
          ...old,
          comments: newComments ?? [],
        };
      });
    });

    return () => {
      commentSocket.emit("leave", slug);
      commentSocket.off("comment:new");
      commentSocket.off("comment:delete");
    };
  }, [slug, queryClient]);

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((res) => res.data?.data),
    retry: false,
  });

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      api.post("/cart", {
        variantId: activeVariant.id,
        amount: 1,
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
    onError: handleError,
  });

  const Specification = ({ Icon, title, value }) => (
    <div className="grid grid-cols-[max-content_auto] grid-rows-2 items-center space-x-6">
      <Icon className="row-span-2 size-7 opacity-50" />
      <span className="font-medium text-emerald-800 dark:text-emerald-400">{title}</span>
      {value}
    </div>
  );

  return (
    <div className="mx-auto w-[min(1200px,92%)] py-10 flex flex-col-reverse lg:flex-row gap-5">
      <div className="space-y-5 min-w-0 flex-1">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg grid overflow-hidden">
          {isProductLoading ? (
            <div className="h-[370px] flex justify-center items-center">
              <FaSpinner className="size-8 animate-spin opacity-50" />
            </div>
          ) : product.imageUrls.length ? (
            <>
              <Swiper slidesPerView={1} spaceBetween={20} modules={[Thumbs, Navigation, Zoom]} zoom={true} navigation={true} thumbs={{ swiper: thumbsSwiper }} className="w-full h-[300px]">
                {product?.imageUrls.map((url) => (
                  <SwiperSlide>
                    <div className="swiper-zoom-container">
                      <Image src={url} className="size-full" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="p-2">
                <Swiper slidesPerView="auto" modules={[Thumbs, FreeMode]} spaceBetween={8} onSwiper={setThumbsSwiper} watchSlidesProgress={true} freeMode={true} className="w-full h-[54px]">
                  {product?.imageUrls.map((url) => (
                    <SwiperSlide className="max-w-[54px] not-[&.swiper-slide-thumb-active]:opacity-50 cursor-pointer">
                      <Image src={url} className="size-full rounded-md" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          ) : (
            <div className="h-[370px] flex justify-center items-center opacity-50 gap-4 flex-col">
              <FaImages className="size-10" />
              <p className="text-xl">No images :(</p>
            </div>
          )}
        </div>
        <Swiper slidesPerView="auto" spaceBetween={20} className="mask-x-from-99% mask-x-to-100%">
          {user && (
            <SwiperSlide className="home-carousel">
              <RatingForm />
            </SwiperSlide>
          )}
          {product
            ? product.ratings.map((rating, i) => (
                <SwiperSlide className="home-carousel">
                  <Rating key={i} rating={rating} />
                </SwiperSlide>
              ))
            : Array.from({ length: 3 }, (_, i) => (
                <SwiperSlide className="home-carousel">
                  <Rating key={i} />
                </SwiperSlide>
              ))}
        </Swiper>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
          <TitleDivider title="Specifications" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Specification Icon={FaArrowsLeftRight} title="Width" value={isProductLoading ? <div className="placeholder w-10 my-1"></div> : product.width + "cm"} />
            <Specification Icon={FaArrowsUpDown} title="Height" value={isProductLoading ? <div className="placeholder w-10 my-1"></div> : product.height + "cm"} />
            <Specification Icon={FaRuler} title="Length" value={isProductLoading ? <div className="placeholder w-10 my-1"></div> : product.length + "cm"} />
            <Specification Icon={FaWeightHanging} title="Weight" value={isProductLoading ? <div className="placeholder w-10 my-1"></div> : product.weight + "g"} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
          <TitleDivider title="Description" />
          {isProductLoading ? (
            <div className="h-[500px] flex justify-center items-center">
              <FaSpinner className="size-8 animate-spin opacity-50" />
            </div>
          ) : (
            <p
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(product?.desc || "No description")),
              }}
            ></p>
          )}
        </div>
        <div className="space-y-4">
          <CommentForm disabled={!product} />
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
            {product ? (
              <>
                <p className="font-bold">{product.comments.length} comments</p>
                {product.comments.map((comment, i) => (
                  <div key={i}>
                    <Comment comment={comment} />
                    <div className="space-y-4 pt-4 pl-4 ml-4 border-l border-gray-300 dark:border-gray-700">
                      <CommentForm parentId={comment.id} />
                      <div className="space-y-2">
                        {comment.replies.map((reply, i) => (
                          <Comment key={i} comment={reply} />
                        ))}
                      </div>
                      <span className="opacity-75">{comment.replies.length ?? 0} replies</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <FaSpinner className="size-6 animate-spin text-gray-600 mx-auto" />
            )}
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col gap-4 min-h-[400px] h-max lg:sticky lg:top-25 min-w-[350px] shrink-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {isProductLoading ? <div className="placeholder w-20 my-1"></div> : <span className={clsx(product.category ?? "opacity-75")}>{product.category?.name || "No category"}</span>}/
            {isProductLoading ? <div className="placeholder w-20 my-1"></div> : <span className={clsx(product.brand ?? "opacity-75")}>{product.brand?.name || "No brand"}</span>}
          </div>
          {isProductLoading ? <div className="placeholder h-5! w-40 mt-2"></div> : <h2 className="font-medium text-xl">{product.name}</h2>}
        </div>
        <ul className="flex flex-wrap items-center gap-2 h-7">
          <li className="mr-2">Tags:</li>
          {isProductLoading ? (
            <FaSpinner className="animate-spin" />
          ) : product?.tags.length ? (
            product.tags.map((tag, i) => (
              <li key={i} className="bg-gray-100 dark:bg-gray-700 rounded-lg py-0.5 px-2">
                {tag}
              </li>
            ))
          ) : (
            <span className="opacity-75">No tag</span>
          )}
        </ul>
        <span className={clsx("text-xl font-medium", activeVariant ? "text-emerald-800 dark:text-emerald-400" : "text-rose-800 dark:text-rose-400")}>
          {isProductLoading ? <div className="placeholder w-20 h-5! my-1"></div> : activeVariant ? longCurrencyFormatter.format(activeVariant.price) : "Contact us!"}
        </span>
        <TitleDivider title="Options" />
        <div className="flex flex-wrap gap-2">
          {isProductLoading ? (
            Array.from({ length: 2 }, (_, i) => (
              <div className="chip dark:not-[.chip--active]:bg-gray-700!">
                <div className="placeholder w-20"></div>
              </div>
            ))
          ) : product?.variants.length ? (
            product.variants.map((variant, i) => {
              const isActive = activeVariant?.id === variant.id;
              return (
                <button
                  key={i}
                  className={clsx("chip dark:not-[.chip--active]:bg-gray-700!", isActive && "chip--active", variant.stockQuantity || "chip--disabled")}
                  onClick={() => {
                    if (variant.stockQuantity) {
                      setActiveVariant(variant);
                    }
                  }}
                >
                  {isActive && <FaCheck />} {variant.name}
                </button>
              );
            })
          ) : (
            <p className="text-center w-full py-1.5 opacity-75">No option</p>
          )}
        </div>
        {isPending || isProductLoading ? (
          <button className="btn btn-primary mt-auto w-full" disabled={true}>
            <FaSpinner className="animate-spin" /> Loading
          </button>
        ) : activeVariant ? (
          <button className="btn btn-primary mt-auto w-full" onClick={() => mutate()}>
            {addedToCart ? (
              <>
                <FaCheck /> Added to cart
              </>
            ) : (
              <>
                <FaBagShopping /> Add to cart!
              </>
            )}
          </button>
        ) : (
          <a href="mailto:support@mint.boutique" className="btn btn-secondary mt-auto w-full">
            <FaEnvelope /> Request a price!
          </a>
        )}
      </div>
    </div>
  );
}
