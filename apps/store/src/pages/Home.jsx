import Hero from "../components/Hero";
import { api } from "@mint-boutique/axios-client";
import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import Promo from "@/components/Promo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaGifts, FaTruckFast } from "react-icons/fa6";

export default function Home() {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products").then((res) => res.data?.data),
  });

  return (
    <>
      <Hero />
      <main className="mx-auto w-[min(1200px,92%)]">
        <Section title="Best sellers">
          <Swiper slidesPerView="auto" spaceBetween={20} modules={[Navigation]} navigation={true} className="mask-x-from-99% mask-x-to-100%">
            {products?.map((product, i) => (
              <SwiperSlide className="max-w-[300px] first:ml-5 last:mr-5 my-5">
                <Card key={i} product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Section>
        <Promo
          title="Free Shipping Service"
          desc="All orders will be shipping free of charge nationwide&mdash;fresh plants guaranteed!"
          Icon={FaTruckFast}
          btnTitle="Learn more"
          btnUrl="/about"
          className="bg-sky-100 text-sky-900"
        />
        <Promo
          title="Join the Loyalty Program"
          desc="Earn 10% back in points on every order&mdash;redeem instantly on your next purchase!"
          Icon={FaGifts}
          btnTitle="Register now"
          btnUrl="/register"
          className="bg-orange-100 text-orange-900"
        />
      </main>
    </>
  );
}
