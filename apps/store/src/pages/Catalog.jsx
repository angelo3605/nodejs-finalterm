import { api } from "@mint-boutique/axios-client";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams, useSearchParams } from "react-router";
import { Image } from "@/components/Image";
import { FaArrowDownWideShort, FaArrowUpShortWide, FaBoxOpen, FaCheck, FaChevronLeft, FaChevronRight, FaSliders } from "react-icons/fa6";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paginationSchema, productFilteringSchema, productSortingSchema } from "@mint-boutique/zod-schemas";
import clsx from "clsx";
import { z } from "zod";
import { useDebounce } from "react-use";
import { getTrackBackground, Range } from "react-range";
import { Card } from "@/components/Card";
import { Fragment, useEffect } from "react";
import { UnsplashCredit } from "@/components/Credit";

const sortByConfig = [
  { by: "name", label: "Name" },
  { by: "price", label: "Price" },
  { by: "createdAt", label: "Recency" },
  { by: "mostOrders", label: "Best sellers" },
];

function getPagination(current, total, window = 1, edges = 1, ellipsis = "...") {
  const range = [];
  const pages = [];

  for (let i = 1; i <= total; i++) {
    if (i <= edges || i > total - edges || (i >= current - window && i <= current + window)) {
      range.push(i);
    }
  }

  let last = 0;
  for (let i of range) {
    if (i - last > 1) {
      pages.push(ellipsis);
    }
    pages.push(i);
    last = i;
  }

  return pages;
}

const [absMinPrice, absMaxPrice] = [0, 10_000_000];

const schema = z.object({
  ...productFilteringSchema.omit({
    isDeleted: true,
    isFeatured: true,
  }).shape,
  ...productSortingSchema.shape,
  ...paginationSchema.shape,
});

const defaultValues = {
  name: "",
  brands: [],
  tags: [],
  sortBy: "mostOrders",
  sortInAsc: false,
  minPrice: absMinPrice,
  maxPrice: absMaxPrice,
  page: 1,
  pageSize: 10,
};

export function Catalog() {
  const location = useLocation();
  const { slug: categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchFocus = searchParams.get("searchFocus") ?? "0";

  let paramValues = schema.safeParse(Object.fromEntries(searchParams));
  const { register, control, setValue, reset, setFocus } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      ...(paramValues.data ?? {}),
    },
  });

  useEffect(() => {
    if (searchFocus === "1") {
      setFocus("name");
    }
  }, [searchFocus]);

  useEffect(() => {
    reset({
      ...defaultValues,
      ...(paramValues.data ?? {}),
    });
  }, [location.pathname, location.search]);

  const values = useWatch({ control });

  const updateSearchParams = (values) => {
    const params = new URLSearchParams();
    if (searchFocus === "1") {
      params.set("searchFocus", searchFocus);
    }
    if (values.name) {
      params.set("name", values.name);
    }
    if (values.brands.length) {
      params.set("brands", values.brands.join(","));
    }
    if (values.tags.length) {
      params.set("tags", values.tags.join(","));
    }
    if (values.sortInAsc) {
      params.set("sortInAsc", values.sortInAsc ? "1" : "0");
    }
    for (const key of ["sortBy", "minPrice", "maxPrice", "page"]) {
      if (values[key]) {
        params.set(key, String(values[key]));
      }
    }
    setSearchParams(params);
  };

  useDebounce(() => updateSearchParams(Object.fromEntries(Object.entries(values).filter(([key, value]) => defaultValues[key] !== value))), 500, [values]);

  const { data: category } = useQuery({
    queryKey: ["categories", categorySlug],
    queryFn: () => api.get(`/categories/${categorySlug}`).then((res) => res.data?.data),
    enabled: !!categorySlug,
  });

  const { data: allBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => api.get("/brands").then((res) => res.data?.data),
  });

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.get("/tags").then((res) => res.data?.data),
  });

  const { data: { data: products, total } = {} } = useQuery({
    queryKey: ["products", paramValues.data, categorySlug],
    queryFn: () =>
      api
        .get(`/products?${searchParams.toString()}`, {
          params: {
            category: categorySlug,
          },
        })
        .then((res) => res.data),
  });

  const numOfPages = Math.ceil((total || 0) / values.pageSize);

  return (
    <>
      <div className="relative">
        <Image src={categorySlug ? category?.imageUrl : `${import.meta.env.VITE_API_URL}/images/all-products.jpg`} className="w-full h-[200px] brightness-75" />
        <div className="flex flex-col gap-2 justify-center items-center absolute inset-0 text-white text-shadow-lg">
          <h2 className="font-bold font-brand text-5xl">{!categorySlug ? "All Products" : category?.name || <div className="placeholder w-40 h-8! my-2"></div>}</h2>
          {categorySlug && (category ? <p>{category?.desc}</p> : <div className="placeholder w-80 my-1"></div>)}
        </div>
        {!categorySlug && (
          <UnsplashCredit
            photographerName="Prudence Earl"
            photographerUrl="https://unsplash.com/@prudenceearl?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            imageUrl="https://unsplash.com/photos/green-leafed-plant-NwBx723XaHw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          />
        )}
      </div>
      <div className="grid lg:grid-cols-[3fr_1fr] gap-8 p-10 mx-auto max-w-400">
        <div className="flex flex-col gap-10">
          <div className={clsx("grid sm:grid-cols-2 xl:grid-cols-3 gap-4 *:w-auto *:min-w-[250px]", products?.length ? "h-max" : "h-full")}>
            {!products ? (
              Array.from({ length: 10 }, (_, i) => <Card key={i} />)
            ) : products.length ? (
              products.map((product, i) => <Card key={i} product={product} />)
            ) : (
              <div className="sm:col-span-2 xl:col-span-3 flex flex-col justify-center items-center">
                <FaBoxOpen className="text-gray-400 dark:text-gray-600 size-10 mb-4" />
                <p className="italic">Nothing here... yet!</p>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-auto">
            <button className="pagination-btn" onClick={() => setValue("page", Math.max(values.page - 1, 1))} disabled={values.page === 1}>
              <FaChevronLeft className="size-3" />
            </button>
            {getPagination(values.page, numOfPages).map((i) => {
              return (
                <button key={i} className={clsx("pagination-btn", i === values.page && "btn-secondary")} onClick={() => setValue("page", i)}>
                  {i}
                </button>
              );
            })}
            <button className="pagination-btn" onClick={() => setValue("page", Math.min(values.page + 1, numOfPages))} disabled={numOfPages === 0 || values.page === numOfPages}>
              <FaChevronRight className="size-3" />
            </button>
          </div>
        </div>
        <form className="space-y-8 -order-1 lg:order-1">
          <h5 className="flex items-center gap-4 font-bold text-xl">
            <FaSliders /> Options
          </h5>
          <label className="floating-label">
            <input {...register("name")} placeholder="" className="floating-label__input" />
            <span className="floating-label__label">Search</span>
          </label>
          <div className="flex flex-col gap-2">
            <span>Sort by</span>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="btn h-9! px-2.5! btn-outline-dark dark:btn-outline-light" onClick={() => setValue("sortInAsc", !values.sortInAsc)}>
                {values.sortInAsc ? <FaArrowUpShortWide /> : <FaArrowDownWideShort />}
              </button>
              <div className="border-r h-7 border-gray-300 dark:border-gray-700 mx-1"></div>
              {sortByConfig.map(({ by, label }, i) => (
                <button key={i} type="button" className={clsx("btn h-9! px-3!", by === values.sortBy ? "btn-primary" : "btn-secondary")} onClick={() => setValue("sortBy", by)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span>Price range</span>
            <Range
              step={100_000}
              min={absMinPrice}
              max={absMaxPrice}
              values={[values.minPrice, values.maxPrice]}
              onChange={(values) => {
                setValue("minPrice", values[0]);
                setValue("maxPrice", values[1]);
              }}
              renderMark={({ props, index }) => (
                <Fragment key={props.key}>
                  {![0, 100].includes(index) && index % 10 === 0 && (
                    <div
                      {...props}
                      key={props.key}
                      className="slider__mark"
                      style={{
                        ...props.style,
                        backgroundColor: values.minPrice < index * 100_000 && index * 100_000 < values.maxPrice ? "white" : "var(--color-emerald-600)",
                      }}
                    ></div>
                  )}
                </Fragment>
              )}
              renderTrack={({ props, children }) => (
                <div className="slider__overlay">
                  <div
                    {...props}
                    key={props.key}
                    className="slider"
                    style={{
                      ...props.style,
                      background: getTrackBackground({
                        values: [values.minPrice, values.maxPrice],
                        colors: ["transparent", "var(--color-emerald-500)", "transparent"],
                        min: absMinPrice,
                        max: absMaxPrice,
                      }),
                    }}
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props }) => <div {...props} key={props.key} className="slider__thumb"></div>}
            />
            <div className="flex items-center">
              <label className="floating-label min-w-[120px] w-full">
                <input {...register("minPrice")} placeholder="" className="floating-label__input" />
                <span className="floating-label__label">Min</span>
              </label>
              <hr className="min-w-4 max-w-20 w-full mt-2 border-gray-300 dark:border-gray-700" />
              <label className="floating-label min-w-[120px] w-full">
                <input {...register("maxPrice")} placeholder="" className="floating-label__input" />
                <span className="floating-label__label">Max</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span>Brands</span>
            <div className="flex flex-wrap gap-2">
              {allBrands?.map((brand, i) => {
                const isActive = values.brands.includes(brand.slug);
                return (
                  <button
                    key={i}
                    type="button"
                    className={clsx("chip", isActive && "chip--active")}
                    onClick={() => setValue("brands", isActive ? values.brands.filter((b) => b !== brand.slug) : values.brands.concat(brand.slug))}
                  >
                    {isActive && <FaCheck />} {brand.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span>Tags</span>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag, i) => {
                const isActive = values.tags.includes(tag);
                return (
                  <button
                    key={i}
                    type="button"
                    className={clsx("chip", isActive && "chip--active")}
                    onClick={() => setValue("tags", isActive ? values.tags.filter((t) => t !== tag) : values.tags.concat(tag))}
                  >
                    {isActive && <FaCheck />} {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
