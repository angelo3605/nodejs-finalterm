import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { brandSchema } from "@mint-boutique/zod-schemas";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrandForm } from "@/forms/brand-form";

export function CreateBrand() {
  const form = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: "" },
    refineCoreProps: {
      resource: "brands",
      action: "create",
    },
  });

  return (
    <CreateView>
      <CreateViewHeader />
      <BrandForm refineForm={form} />
    </CreateView>
  );
}
