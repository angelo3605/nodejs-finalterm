import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { ImageManager } from "@/components/image-manager";

export function CreateProduct() {
  const formLoading = false;

  return (
    <CreateView>
      <CreateViewHeader />
      <LoadingOverlay loading={formLoading}>
        <ImageManager />
      </LoadingOverlay>
    </CreateView>
  );
}
