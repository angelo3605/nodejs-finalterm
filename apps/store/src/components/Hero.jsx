import { Link } from "react-router";
import { FaMagnifyingGlass, FaSliders } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { Card } from "@/components/Card";

export default function Hero() {
  const { data: featuredProducts } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => api.get("/products?isFeatured=1").then((res) => res.data?.data),
  });
  return (
    <section className="w-full bg-fancy text-white">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 mx-auto w-[min(1200px,92%)] py-10">
        <div className="flex-1 flex flex-col gap-4">
          <p className="uppercase opacity-75 font-bold tracking-widest">&mdash; Fresh plants, fresh vibe</p>
          <h1 className="text-5xl font-bold font-brand">Good mood blooms from inside 🌱</h1>
          <p className="leading-wide py-4">
            Bring fresh energy into your home with curated plants and pots. Our environment, the world in which we live and work, is a mirror of our attitudes and expectations.
          </p>
          <div className="flex gap-2">
            <Link to="/all" className="btn btn-outline-light">
              <FaSliders className="size-5" />
            </Link>
            <input className="border border-white/50 outline-none px-4 w-full rounded-lg focus:border-white" placeholder="Search for products..." />
            <button className="btn btn-cta">
              <FaMagnifyingGlass className="size-5" />
            </button>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-cta btn-jump">Shop now</button>
            <button className="btn btn-outline-light btn-jump">Explore</button>
          </div>
        </div>
        <div className="relative">
          <Swiper
            slidesPerView="auto"
            modules={[EffectCoverflow, Pagination, Autoplay]}
            effect="coverflow"
            pagination={true}
            centeredSlides={true}
            autoplay={{ delay: 5000 }}
            className="max-w-screen lg:mask-x-from-90% lg:mask-x-to-100% lg:w-[450px]"
            coverflowEffect={{
              slideShadows: false,
            }}
          >
            {featuredProducts?.map((product) => (
              <SwiperSlide className="max-w-[300px] my-5">
                <Card product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
