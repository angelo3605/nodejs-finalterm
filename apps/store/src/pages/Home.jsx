import Hero from "../components/Hero";
import Banner from "../components/Banner";
import { api } from "@mint-boutique/axios-client";
import { useQuery } from "@tanstack/react-query";
import { Section } from "../components/Section";
import { Card } from "../components/Card";

export default function Home() {
  const { data: { products } = {}, isPending } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products").then((res) => res.data),
  });

  return (
    <>
      <Hero />
      <main className="mx-auto w-[min(1200px,92%)]">
        <Section title="Best sellers">
          <div className="space-x-8">{isPending ? "Loading..." : products.map((product, i) => <Card key={i} product={product} />)}</div>
        </Section>
        <Section title="New arrivals">
          <div className="space-x-8">{isPending ? "Loading..." : products.map((product, i) => <Card key={i} product={product} />)}</div>
        </Section>
      </main>
      <Banner />
    </>
  );
}
