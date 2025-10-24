import { ProductForm } from "@/forms/product-form";
import { productSchema } from "@mint-boutique/zod-schemas";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";

export function EditProduct() {
  const { slug } = useParams();

  const form = useForm({
    resolver: zodResolver(productSchema),
    refineCoreProps: {
      resource: "products",
      action: "edit",
      id: slug,
    },
  });

  return (
    <EditView>
      <EditViewHeader />
      <ProductForm refineForm={form} />
    </EditView>
  );
}
