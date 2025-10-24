import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";
import { Blocks } from "lucide-react";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

function strToOkLch(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return `oklch(70% 0.3 ${Math.abs(hash) % 360}deg / 0.2)`;
}

export function ListCategories() {
  const { result, query } = useList({
    resource: "categories",
  });

  const categories = result.data ?? [];

  return (
    <ListView>
      <ListViewHeader />
      <div className="grid grid-cols-4 gap-4">
        {categories.map((category) => (
          <div className="flex flex-col overflow-hidden border rounded">
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                className="aspect-3/2 object-cover"
              />
            ) : (
              <div
                className="aspect-3/2 flex justify-center items-center"
                style={{ background: strToOkLch(category.id) }}
              >
                <Blocks className="size-12 text-foreground/33" />
              </div>
            )}
            <div className="p-4 space-y-2">
              <span className="block">{category.name}</span>
              <div className="grid grid-cols-2 gap-2">
                <EditButton
                  size="sm"
                  variant="ghost"
                  resource="categories"
                  recordItemId={category.slug}
                  meta={{ slug: category.slug }}
                  className="w-full"
                />
                <DeleteButton
                  size="sm"
                  variant="ghost"
                  resource="categories"
                  recordItemId={category.slug}
                  meta={{ slug: category.slug }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ListView>
  );
}
