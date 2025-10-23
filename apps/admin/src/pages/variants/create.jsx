import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { VariantForm } from "@/forms/variant-form";
import { variantSchema } from "@mint-boutique/zod-schemas";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router";

export function CreateVariant() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const form = useForm({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      productSlug: params.get("productSlug") ?? "",
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
