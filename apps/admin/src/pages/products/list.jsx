import { useMemo } from "react";
import { Link } from "react-router";
import { useNavigation, useResourceParams } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ListProducts() {
  const error = null;

  const { showUrl } = useNavigation();
  const { resource } = useResourceParams();

  const columns = useMemo(() => [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link to={showUrl(resource.name, row.original.slug)} className="hover:underline">
          {row.original.name}
        </Link>
      ),
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => {
        const prices = row.original.variants.map((variant) => variant.price);
        if (prices.length === 0) {
          return "Not for sale";
        }

        const formatter = Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          maximumFractionDigits: 0,
        });

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return minPrice === maxPrice ? formatter.format(minPrice) : `${formatter.format(minPrice)} — ${formatter.format(maxPrice)}`;
      },
    },
    {
      id: "stockQuantity",
      header: "Stock",
      cell: ({ row }) => {
        const totalStock = row.original.variants.reduce((stock, variant) => stock + variant.stockQuantity, 0);
        return <span className={cn(totalStock <= 20 && "text-red-600")}>{totalStock}</span>;
      },
    },
    {
      id: "variants",
      header: "Variants",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.variants.slice(0, 3).map((variant) => (
            <Badge variant="outlined">{variant.name}</Badge>
          ))}
        </div>
      ),
    },
  ]);

  const table = useTable({ columns });

  return (
    <ListView>
      <ListViewHeader />
      {error ? <></> : <DataTable table={table} />}
    </ListView>
  );
}
