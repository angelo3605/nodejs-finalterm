import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { DropZone } from "./drop-zone";
import { Trash, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "./refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { api } from "@mint-boutique/axios-client";
import { DeleteButton } from "./refine-ui/buttons/delete";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUpdate } from "@refinedev/core";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "./ui/form";
import { Input } from "./ui/input";

function AltTextPopup({ row, table }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: { altText: row.original.altText },
  });

  const { mutate } = useUpdate({
    resource: "images",
  });

  const onSubmit = (values) => {
    mutate(
      {
        values,
        id: row.original.id,
      },
      {
        onSuccess: async () => {
          setOpen(false);
          await table.refetch();
        },
      },
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="altText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image description</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe the image..." {...field} />
                  </FormControl>
                  <FormDescription>Add an alternative text to make the image accessible.</FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

export function ImageManager() {
  const columns = useMemo(
    () => [
      {
        id: "altText",
        header: "Description",
        cell: ({ row }) => {
          const altText = row.original.altText;
          return (
            <div className="flex items-center gap-2">
              <img src={`${api.defaults.baseURL}${row.original.url}`} className="size-[40px] object-cover rounded-sm" />
              {altText ?? <span className="opacity-75">No description provided</span>}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 30,
        cell: ({ row, table }) => {
          const id = row.original.id;
          return (
            <>
              <AltTextPopup row={row} table={table} />
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
  const {
    refineCore: { tableQuery },
  } = table;

  const uploadForm = useForm({
    defaultValues: { images: [] },
  });

  const onSubmit = async ({ images }) => {
    if (images.length > 0) {
      const formData = new FormData();
      images.forEach((image) => formData.append("images", image));

      await api.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      uploadForm.reset();
      await tableQuery.refetch();
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-2 flex flex-col justify-between gap-2">
        <DropZone control={uploadForm.control} name="images" maxFiles={5} maxSize={5_000_000} accepts={{ "images/*": [] }} />
        <Button onClick={uploadForm.handleSubmit(onSubmit)} className="w-full">
          Submit
        </Button>
      </div>
      <div className="col-span-3">
        <DataTable table={table} />
      </div>
    </div>
  );
}
