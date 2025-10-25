import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTable } from "@refinedev/react-table";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Pencil,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { useMemo } from "react";

export function ListProducts() {
  const columns = useMemo(() => [
    {
      id: "expander",
      header: "",
      size: 80,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
        </Button>
      ),
    },
    {
      id: "name",
      header: "Name",
      size: 300,
      cell: ({ row: { original: product } }) => (
        <div className="flex items-center gap-4">
          {product.imageUrls.length > 0 ? (
            <img
              src={product.imageUrls[0]}
              className="shrink-0 size-12 object-cover rounded-sm"
            />
          ) : (
            <div className="flex justify-center items-center shrink-0 size-12 bg-muted text-muted-foreground rounded-sm">
              <Package className="opacity-33" />
            </div>
          )}
          <ShowButton
            variant="link"
            className="text-foreground"
            recordItemId={product.slug}
            meta={{ slug: product.slug }}
          >
            {product.name}
          </ShowButton>
        </div>
      ),
    },
    {
      id: "category",
      accessorKey: "category.name",
      header: "Category",
      size: 120,
    },
    {
      id: "brand",
      accessorKey: "brand.name",
      header: "Brand",
      size: 120,
    },
    {
      id: "actions",
      header: "Actions",
      size: 120,
      cell: ({ row: { original: product } }) => (
        <>
          <EditButton
            variant="ghost"
            size="icon"
            recordItemId={product.slug}
            meta={{ slug: product.slug }}
          >
            <Pencil />
          </EditButton>
          <DeleteButton
            variant="ghost"
            size="icon"
            recordItemId={product.slug}
            meta={{ slug: product.slug }}
          >
            <Trash />
          </DeleteButton>
        </>
      ),
    },
  ]);

  const table = useTable({
    columns,
    getRowCanExpand: () => true,
  });
  const {
    refineCore: {
      tableQuery: { refetch },
    },
  } = table;

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    [],
  );

  const renderSubComponent = ({ row: { original: product } }) => (
    <Table>
      <TableHeader className={cn(product.variants?.length > 0 && "border-b")}>
        <TableRow>
          <TableHead>Variant</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {product.variants?.map((variant) => (
          <TableRow key={variant.id}>
            <TableCell>{variant.name}</TableCell>
            <TableCell>{formatter.format(variant.price)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {variant.stockQuantity}{" "}
                {variant.stockQuantity < 5 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TriangleAlert className="size-5 text-yellow-700 dark:text-yellow-300" />
                    </TooltipTrigger>
                    <TooltipContent>Inventory low!</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TableCell>
            <TableCell>
              <EditButton
                variant="ghost"
                size="icon"
                resource="variants"
                recordItemId={variant.id}
                meta={{ slug: product.slug }}
              >
                <Pencil />
              </EditButton>
              <DeleteButton
                variant="ghost"
                size="icon"
                resource="variants"
                recordItemId={variant.id}
                meta={{ slug: product.slug }}
                onSuccess={async () => await refetch()}
              >
                <Trash />
              </DeleteButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>
            <CreateButton
              resource="variants"
              meta={{ slug: product.slug }}
              size="sm"
            />
          </TableCell>
          <TableCell colSpan={3} className="text-right">
            {product.variants?.length} variants
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );

  return (
    <ListView>
      <ListViewHeader />
      <DataTable table={table} renderSubComponent={renderSubComponent} />
    </ListView>
  );
}
