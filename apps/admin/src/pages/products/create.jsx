import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { ProductForm } from "@/forms/product-form";
import { productSchema } from "@mint-boutique/zod-schemas";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function CreateProduct() {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      desc: "",
      imageUrls: [],
      brand: "",
      category: "",
    },
    refineCoreProps: {
      resource: "products",
      action: "create",
    },
  });

  return (
    <CreateView>
      <CreateViewHeader />
      <ProductForm refineForm={form} />
    </CreateView>
  );
}
