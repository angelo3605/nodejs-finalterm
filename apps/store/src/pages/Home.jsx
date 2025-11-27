import Hero from "../components/Hero";
import { api } from "@mint-boutique/axios-client";
import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import Promo from "@/components/Promo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaArrowRight, FaGifts, FaTruckFast } from "react-icons/fa6";
import { Image } from "@/components/Image";
import { Link } from "react-router";

function ProductCarousel({ products }) {
  return (
    <Swiper slidesPerView="auto" modules={[Navigation]} navigation={true} className="mask-x-from-99% mask-x-to-100%">
      {products
        ? products.map((product, i) => (
            <SwiperSlide key={i} className="home-carousel">
              <Card product={product} />
            </SwiperSlide>
          ))
        : Array.from({ length: 4 }, (_, i) => (
            <SwiperSlide key={i} className="home-carousel">
              <Card />
            </SwiperSlide>
          ))}
    </Swiper>
  );
}

export default function Home() {
  const { data: bestSellers } = useQuery({
    queryKey: ["products", "mostOrders"],
    queryFn: () => api.get("/products?sortBy=mostOrders").then((res) => res.data?.data),
  });

  const { data: newArrivals } = useQuery({
    queryKey: ["products", "createdAt"],
    queryFn: () => api.get("/products?sortBy=createdAt").then((res) => res.data?.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res) => res.data?.data),
  });

  return (
    <>
      <Hero />
      <main className="mx-auto w-[min(1200px,92%)]">
        <Section title="Best sellers" id="bestSellers">
          <ProductCarousel products={bestSellers} />
        </Section>
        <Promo
          title="Join the Loyalty Program"
          desc="Earn 10% back in points on every order&mdash;redeem instantly on your next purchase!"
          Icon={FaGifts}
          btnTitle="Register now"
          btnUrl="/register"
          className="bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-50"
        />
        <Section title="New arrivals">
          <ProductCarousel products={newArrivals} />
        </Section>
        <Section title="Categories">
          <Swiper slidesPerView="auto" spaceBetween={20} modules={[Navigation]} navigation={true} className="mask-x-from-99% mask-x-to-100%">
            {categories?.map((category, i) => (
              <SwiperSlide key={i} className="max-w-[250px] first:ml-5 last:mr-5 my-5">
                <div className="relative overflow-hidden rounded-lg shadow-lg aspect-4/3">
                  <Image src={category.imageUrl} className="h-full" />
                  <div className="absolute inset-0 flex flex-col gap-1 p-4 text-white bg-linear-to-br from-black/75 to-transparent">
                    <span className="font-bold text-xl">{category.name}</span>
                    <span>{category.desc}</span>
                    <Link to={`/category/${category.slug}`} className="btn btn-cta h-9! w-max mt-auto btn-jump shadow-lg">
                      More <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Section>
        <Promo
          title="Fast, Reliable Delivery"
          desc="Enjoy quick nationwide delivery with care-focused handling to keep every plant fresh and healthy on arrival."
          Icon={FaTruckFast}
          btnTitle="Learn more"
          btnUrl="/about"
          className="bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-50"
        />
      </main>
    </>
  );
}
