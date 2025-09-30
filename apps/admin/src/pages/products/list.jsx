import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";

export function ListProducts() {
  const error = null;

  const columns = useMemo(() => [
    {
      id: "name",
      accessorKey: "name",
    },
  ]);

  const table = useTable({
    columns,
    refineCoreProps: {
      resource: "products",
    },
  });

  return (
    <ListView>
      <ListViewHeader />
      {error ? <></> : <DataTable table={table} />}
    </ListView>
  );
}
