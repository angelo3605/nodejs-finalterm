import { CategoryForm } from "@/forms/category-form";
import { categorySchema } from "@mint-boutique/zod-schemas";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { useParams } from "react-router";

export function EditCategory() {
  const { slug } = useParams();

  const form = useForm({
    resolver: zodResolver(categorySchema),
    refineCoreProps: {
      resource: "categories",
      action: "edit",
      id: slug,
    },
  });

  return (
    <EditView>
      <EditViewHeader />
      <CategoryForm refineForm={form} />
    </EditView>
  );
}
