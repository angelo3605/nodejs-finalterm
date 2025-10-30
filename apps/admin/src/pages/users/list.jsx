import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { useTable } from "@refinedev/react-table";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdate } from "@refinedev/core";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const roleColors = {
  CUSTOMER: "bg-chart-4/10! *:text-chart-4!",
  ADMIN: "bg-chart-1/10! *:text-chart-1!",
  BLOCKED: "bg-chart-3/10! *:text-chart-3!",
};

export function ListUsers() {
  const columns = useMemo(() => [
    {
      id: "fullName",
      accessorKey: "fullName",
      header: "Full Name",
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email Address",
    },
    {
      id: "role",
      header: "Role",
      cell: ({ row: { original: user } }) => {
        const {
          mutate,
          mutation: { isPending },
        } = useUpdate({
          resource: "users",
        });

        return (
          <div className="flex items-center gap-2 p-1">
            <Select
              value={user.role}
              onValueChange={(role) =>
                mutate({ id: user.id, values: { role } })
              }
              disabled={isPending}
            >
              <SelectTrigger
                className={cn(
                  "w-32 border-none shadow-none rounded-full h-8!",
                  roleColors[user.role],
                )}
              >
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Spinner className={isPending || "opacity-0"} />
          </div>
        );
      },
    },
  ]);

  const table = useTable({
    columns,
  });

  return (
    <ListView>
      <ListViewHeader />
      <DataTable table={table} />
    </ListView>
  );
}
