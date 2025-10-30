import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { useList } from "@refinedev/core";
import { Blocks } from "lucide-react";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { SimpleCard } from "@/components/simple-card";

export function ListCategories() {
  const {
    result,
    query: { isLoading },
  } = useList({
    resource: "categories",
  });

  const categories = result.data ?? [];

  return (
    <ListView>
      <ListViewHeader />
      <LoadingOverlay loading={isLoading} className="h-[300px]">
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category) => (
            <SimpleCard
              resource="categories"
              slug={category.slug}
              name={category.name}
              imageUrl={category.imageUrl}
              FallbackIcon={Blocks}
            />
          ))}
        </div>
      </LoadingOverlay>
    </ListView>
  );
}
