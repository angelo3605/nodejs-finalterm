import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { CategoryForm } from "@/forms/category-form";
import { categorySchema } from "@mint-boutique/zod-schemas";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function CreateCategory() {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", desc: "", imageUrl: "" },
    refineCoreProps: {
      resource: "categories",
      action: "create",
    },
  });

  return (
    <CreateView>
      <CreateViewHeader />
      <CategoryForm refineForm={form} />
    </CreateView>
  );
}
