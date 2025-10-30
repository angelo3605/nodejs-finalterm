import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { api } from "@mint-boutique/axios-client";
import DOMPurify from "dompurify";
import { marked } from "marked";

export default function Product() {
  const { cat, id } = useParams();

  const {
    isPending,
    isError,
    data: product,
    error,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: () => api.get(`/products/${id}`).then((res) => res.data?.data),
  });

  if (isPending) {
    return "Loading...";
  }

  if (isError) {
    return error.message;
  }

  if (product.category?.slug !== cat) {
    return "Invalid category";
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
