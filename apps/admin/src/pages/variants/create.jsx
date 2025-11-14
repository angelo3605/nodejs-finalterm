import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { VariantForm } from "@/forms/variant-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variantSchema } from "@mint-boutique/zod-schemas";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "react-router";

export function CreateVariant() {
  const { slug: productSlug } = useParams();

  const form = useForm({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      productSlug,
      name: "",
      price: "",
      stockQuantity: "",
    },
    refineCoreProps: {
      resource: "variants",
      action: "create",
    },
  });

  return (
    <CreateView>
      <CreateViewHeader />
      <VariantForm refineForm={form} />
    </CreateView>
  );
}
