import { discountCodeSchema } from "@mint-boutique/zod-schemas";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { useParams } from "react-router";
import { DiscountCodeForm } from "@/forms/discount-code-form";

export function EditDiscountCode() {
  const { code } = useParams();

  const form = useForm({
    resolver: zodResolver(discountCodeSchema),
    refineCoreProps: {
      resource: "discount-codes",
      action: "edit",
      id: code,
    },
  });

  return (
    <EditView>
      <EditViewHeader />
      <DiscountCodeForm refineForm={form} />
    </EditView>
  );
}
