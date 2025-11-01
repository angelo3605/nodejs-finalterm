import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { api } from "@mint-boutique/axios-client";
import DOMPurify from "dompurify";
import { marked } from "marked";

export default function Product() {
  const { slug } = useParams();

  const { isPending, data: product } = useQuery({
    queryKey: ["products", slug],
    queryFn: () => api.get(`/products/${slug}`).then((res) => res.data?.data),
  });

  if (isPending) {
    return "Loading...";
  }

  return (
    <>
      <h1>{product.name}</h1>
      {product.variants.map((variant) => (
        <div>{variant.name}</div>
      ))}
      <span>
        {product.category?.name} / {product.brand?.name}
      </span>
      {product.imageUrls.map((url) => (
        <img src={url} height={300} />
      ))}
      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(product.desc ?? "")) }}></p>
    </>
  );
}
