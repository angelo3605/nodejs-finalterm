import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { VariantForm } from "@/forms/variant-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variantSchema } from "@mint-boutique/zod-schemas";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "react-router";

export function EditVariant() {
  const { slug: productSlug, id } = useParams();

  const form = useForm({
    resolver: zodResolver(variantSchema),
    defaultValues: { productSlug },
    refineCoreProps: {
      resource: "variants",
      action: "edit",
      id,
    },
  });

  return (
    <EditView>
      <EditViewHeader />
      <VariantForm refineForm={form} />
    </EditView>
  );
}
