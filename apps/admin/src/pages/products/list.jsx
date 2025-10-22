import { useMemo } from "react";
import { Link } from "react-router";
import { useNavigation, useResourceParams } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ChevronDown, ChevronUp, Package, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

export function ListProducts() {
  const error = null;

  const { showUrl } = useNavigation();
  const { resource } = useResourceParams();

  const columns = useMemo(() => [
    {
      id: "expander",
      header: "",
      size: 60,
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
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          {row.original.imageUrls.length > 0 ? (
            <img src={row.original.imageUrls[0]} />
          ) : (
            <div className="flex justify-center items-center shrink-0 size-12 bg-muted text-muted-foreground border rounded-xs">
              <Package className="opacity-33" />
            </div>
          )}
          <Link
            to={showUrl(resource.name, row.original.slug)}
            className="truncate hover:underline"
          >
            {row.original.name}
          </Link>
        </div>
      ),
    },
    {
      id: "category",
      accessorKey: "category.name",
      header: "Category",
    },
    {
      id: "brand",
      accessorKey: "brand.name",
      header: "Brand",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <>
          <EditButton
            variant="ghost"
            size="icon"
            recordItemId={row.original.id}
          >
            <Pencil />
          </EditButton>
          <DeleteButton
            variant="ghost"
            size="icon"
            recordItemId={row.original.id}
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

  const renderSubComponent = ({ row }) => (
    <Table>
      <TableHeader className="border-b">
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Variant</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {row.original.variants?.map((variant) => (
          <TableRow key={variant.id}>
            <TableCell></TableCell>
            <TableCell>{variant.name}</TableCell>
            <TableCell>{variant.price}</TableCell>
            <TableCell>{variant.stockQuantity}</TableCell>
            <TableCell>
              <EditButton
                variant="ghost"
                size="icon"
                resource="variants"
                recordItemId={variant.id}
              >
                <Pencil />
              </EditButton>
              <DeleteButton
                variant="ghost"
                size="icon"
                resource="variants"
                recordItemId={variant.id}
              >
                <Trash />
              </DeleteButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <ListView>
      <ListViewHeader />
      {error ? (
        <></>
      ) : (
        <DataTable table={table} renderSubComponent={renderSubComponent} />
      )}
    </ListView>
  );
}
