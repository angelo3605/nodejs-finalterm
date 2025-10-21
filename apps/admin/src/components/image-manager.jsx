import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { DropZone } from "./drop-zone";
import { Image, Trash } from "lucide-react";
import { useMemo } from "react";
import { DataTable } from "./refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { api } from "@mint-boutique/axios-client";
import { DeleteButton } from "./refine-ui/buttons/delete";
import { Checkbox } from "@/components/ui/checkbox";

export function ImageManager() {
  const columns = useMemo(
    () => [
      {
        id: "url",
        size: 20,
        header: ({ table }) => <Checkbox checked={table.getIsSomeRowsSelected() ? "intermediate" : table.getIsAllRowsSelected()} onCheckedChange={table.getToggleAllRowsSelectedHandler()} />,
        cell: ({ row }) => <Checkbox checked={row.getIsSomeSelected() ? "intermediate" : row.getIsSelected()} disabled={!row.getCanSelect()} onCheckedChange={row.getToggleSelectedHandler()} />,
      },
      {
        id: "altText",
        header: "Description",
        cell: ({ row }) => {
          const altText = row.original.altText;
          return (
            <div className="flex items-center gap-2">
              <img src={`${api.defaults.baseURL}${row.original.url}`} className="size-[40px] object-cover" />
              {altText ?? <span className="opacity-75">No description provided</span>}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 40,
        cell: ({ row }) => {
          const id = row.original.id;
          return (
            <>
              <DeleteButton variant="ghost" size="icon" resource="images" recordItemId={id}>
                <Trash />
              </DeleteButton>
            </>
          );
        },
      },
    ],
    [],
  );

  const table = useTable({
    columns,
    refineCoreProps: {
      resource: "images",
    },
  });

  const form = useForm({
    defaultValues: { images: [] },
  });

  const onSubmit = async ({ images }) => {
    if (images.length > 0) {
      const formData = new FormData();
      images.forEach((image) => formData.append("images", image));

      await api.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      form.reset();
      await table.refineCore.tableQuery.refetch();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Image /> Select image(s)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[960px]">
        <DialogHeader>
          <DialogTitle>Image Manager</DialogTitle>
          <DialogDescription>Upload, preview and manage your images here.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2 flex flex-col justify-between gap-2">
            <DropZone control={form.control} name="images" maxFiles={5} maxSize={5_000_000} accepts={{ "images/*": [] }} />
            <Button onClick={form.handleSubmit(onSubmit)} className="w-full">
              Submit
            </Button>
          </div>
          <div className="col-span-3">
            <DataTable table={table} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
