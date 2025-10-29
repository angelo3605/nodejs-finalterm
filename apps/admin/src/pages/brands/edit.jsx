import { brandSchema } from "@mint-boutique/zod-schemas";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { useParams } from "react-router";
import { BrandForm } from "@/forms/brand-form";

export function EditBrand() {
  const { slug } = useParams();

  const form = useForm({
    resolver: zodResolver(brandSchema),
    refineCoreProps: {
      resource: "brands",
      action: "edit",
      id: slug,
    },
  });

  return (
    <EditView>
      <EditViewHeader />
      <BrandForm refineForm={form} />
    </EditView>
  );
}
