import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { api } from "@mint-boutique/axios-client";
import { formatDistanceToNow } from "date-fns";
import { FaPaperPlane, FaRegStar, FaSpinner, FaStar, FaTrash } from "react-icons/fa6";
import { io } from "socket.io-client";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { commentSchema, ratingSchema } from "@mint-boutique/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import toast from "react-hot-toast";
import { handleError } from "@/utils/errorHandler";

const commentSocket = io(`${import.meta.env.VITE_API_URL}/comments`);
const ratingSocket = io(`${import.meta.env.VITE_API_URL}/ratings`);

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
    onSuccess: () => {
      reset();
      toast.success("Thank you for rating out product!");
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

  const { data: product } = useQuery({
    queryKey: ["products", slug],
    queryFn: () => api.get(`/products/${slug}`).then((res) => res.data?.data),
  });

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

  return (
    <div className="mx-auto w-[min(1200px,92%)] py-10 space-y-5">
      <button className="btn btn-primary" onClick={() => toast.success("Hello, world!")}>
        Toast test
      </button>
      <div>
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
  );
}
