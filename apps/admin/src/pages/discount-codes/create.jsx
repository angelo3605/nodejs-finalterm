import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { discountCodeSchema } from "@mint-boutique/zod-schemas";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DiscountCodeForm } from "@/forms/discount-code-form";

export function CreateDiscountCode() {
  const form = useForm({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      name: "",
      type: "",
      value: 0.0,
      desc: "",
      usageLimit: 0,
      numOfUsage: 0,
    },
    refineCoreProps: {
      resource: "discount-codes",
      action: "create",
    },
  });

  return (
    <CreateView>
      <CreateViewHeader />
      <DiscountCodeForm refineForm={form} />
    </CreateView>
  );
}
