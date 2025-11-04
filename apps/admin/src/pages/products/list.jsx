import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {
  DataTableFilterCombobox,
  DataTableFilterDropdownText,
} from "@/components/refine-ui/data-table/data-table-filter";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
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
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { useSelect } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import {
  ChevronDown,
  ChevronUp,
  Crown,
  Package,
  Pencil,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { useMemo } from "react";
import { Image } from "@/components/image.jsx";

export function ListProducts() {
  const { options: brands } = useSelect({
    resource: "brands",
    optionLabel: "name",
    optionValue: "slug",
  });

  const { options: categories } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "slug",
  });

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
      size: 300,
      header: ({ column, table }) => (
        <div className="flex items-center gap-1">
          <span>Name</span>
          <DataTableFilterDropdownText
            operators={["contains"]}
            column={column}
            table={table}
            placeholder="Search for products"
          />
          <DataTableSorter column={column} />
        </div>
      ),
      cell: ({ row: { original: product } }) => (
        <div className="flex items-center gap-4">
          <Image
            src={product.imageUrls?.[0]}
            className="shrink-0 size-12 object-cover rounded-sm"
          />
          {product.isFeatured && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Crown className="size-5 text-yellow-500" />
              </TooltipTrigger>
              <TooltipContent>Featured</TooltipContent>
            </Tooltip>
          )}
          <span className="font-medium">{product.name}</span>
          {/*<ShowButton*/}
          {/*  variant="link"*/}
          {/*  className="text-foreground p-0"*/}
          {/*  recordItemId={product.slug}*/}
          {/*  meta={{ slug: product.slug }}*/}
          {/*>*/}
          {/*  {product.name}*/}
          {/*</ShowButton>*/}
        </div>
      ),
    },
    {
      id: "category",
      cell: ({ row: { original: product } }) => (
        <span className={cn(product.category?.name || "opacity-75")}>
          {product.category?.name || "No category"}
        </span>
      ),
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span>Category</span>
          <DataTableFilterCombobox
            column={column}
            operators={["in"]}
            multiple={false}
            options={categories}
          />
        </div>
      ),
      size: 120,
    },
    {
      id: "brand",
      cell: ({ row: { original: product } }) => (
        <span className={cn(product.brand?.name || "opacity-75")}>
          {product.brand?.name || "No brand"}
        </span>
      ),
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span>Brand</span>
          <DataTableFilterCombobox
            column={column}
            operators={["in"]}
            multiple={true}
            options={brands}
          />
        </div>
      ),
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
            <TableCell>{longCurrencyFormatter.format(variant.price)}</TableCell>
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
