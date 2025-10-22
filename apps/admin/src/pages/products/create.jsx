import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { ImagePicker } from "@/components/image-picker";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

export function CreateProduct() {
  const formLoading = false;

  const form = useForm({
    defaultValues: { imageUrls: [] },
  });

  return (
    <CreateView>
      <CreateViewHeader />
      <LoadingOverlay loading={formLoading}>
        <ImagePicker control={form.control} name="imageUrls" />
      </LoadingOverlay>
    </CreateView>
  );
}
