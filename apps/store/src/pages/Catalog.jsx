import { api } from "@mint-boutique/axios-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Image } from "@/components/Image";

export function Catalog() {
  const { slug: categorySlug } = useParams();

  const { data: category } = useQuery({
    queryKey: ["categories", categorySlug],
    queryFn: () => api.get(`/categories/${categorySlug}`).then((res) => res.data?.data),
  });

  return (
    <>
      <div className="relative">
        <Image src={category?.imageUrl} className="w-full h-[200px] brightness-75" />
        <div className="flex flex-col gap-2 justify-center items-center absolute inset-0 text-white text-shadow-lg">
          <h2 className="font-bold font-brand text-5xl">{category?.name}</h2>
          <p>{category?.desc}</p>
        </div>
      </div>
    </>
  );
}
