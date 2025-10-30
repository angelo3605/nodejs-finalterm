import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { useList } from "@refinedev/core";
import { Blocks } from "lucide-react";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { SimpleCard } from "@/components/simple-card";

export function ListBrands() {
  const {
    result,
    query: { isLoading },
  } = useList({
    resource: "brands",
  });

  const brands = result.data ?? [];

  return (
    <ListView>
      <ListViewHeader />
      <LoadingOverlay loading={isLoading} className="h-[300px]">
        <div className="grid grid-cols-4 gap-4">
          {brands.map((brand) => (
            <SimpleCard
              resource="brands"
              slug={brand.slug}
              name={brand.name}
              imageUrl={brand.imageUrl}
              FallbackIcon={Blocks}
            />
          ))}
        </div>
      </LoadingOverlay>
    </ListView>
  );
}
