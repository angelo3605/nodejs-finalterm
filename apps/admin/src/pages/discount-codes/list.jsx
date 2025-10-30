import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { cn } from "@/lib/utils";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { useTable } from "@refinedev/react-table";
import { Pencil, Trash } from "lucide-react";
import { useMemo } from "react";

export function ListDiscountCodes() {
  const columns = useMemo(() => [
    {
      id: "code",
      header: "Discount Code",
      cell: ({ row: { original: discountCode } }) => (
        <pre>{discountCode.code}</pre>
      ),
    },
    {
      id: "value",
      header: "Value",
      cell: ({ row: { original: discountCode } }) =>
        discountCode.type === "FIXED"
          ? longCurrencyFormatter.format(discountCode.value)
          : `${discountCode.value}%`,
    },
    {
      id: "usageLimit",
      accessorKey: "usageLimit",
      header: "Usage Limit",
    },
    {
      id: "numOfUsage",
      header: "No. of Usage",
      cell: ({ row: { original: discountCode } }) => (
        <span
          className={cn(
            discountCode.numOfUsage >= discountCode.usageLimit &&
              "text-destructive",
          )}
        >
          {discountCode.numOfUsage}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 120,
      cell: ({ row: { original: discountCode } }) => (
        <>
          <EditButton
            variant="ghost"
            size="icon"
            recordItemId={discountCode.code}
            meta={{ code: discountCode.code }}
          >
            <Pencil />
          </EditButton>
          <DeleteButton
            variant="ghost"
            size="icon"
            recordItemId={discountCode.code}
            meta={{ code: discountCode.code }}
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

  return (
    <ListView>
      <ListViewHeader />
      <DataTable table={table} />
    </ListView>
  );
}
