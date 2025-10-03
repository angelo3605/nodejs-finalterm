import { useMemo } from "react";
import { Link } from "react-router";
import { useNavigation, useResourceParams } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";

export function ListProducts() {
  const error = null;

  const { showUrl } = useNavigation();
  const { resource } = useResourceParams();

  const columns = useMemo(() => [
    {
      id: "name",
      header: "Product name",
      cell: ({ row }) => (
        <Link to={showUrl(resource.name, row.original.id)} className="hover:underline">
          {row.original.name}
        </Link>
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
