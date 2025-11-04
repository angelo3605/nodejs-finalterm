import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { DropZone } from "./drop-zone";
import { Trash, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "./refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { api } from "@mint-boutique/axios-client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDelete, useUpdate } from "@refinedev/core";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { DeleteButton } from "./refine-ui/buttons/delete";
import { Image } from "@/components/image.jsx";
import { formatDate } from "date-fns";

function AltTextPopover({ id, defaultValue, onSuccess }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: { altText: defaultValue || "" },
  });

  const { mutate } = useUpdate({
    mutationOptions: {
      onSuccess: async () => {
        setOpen(false);
        await onSuccess();
      },
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              mutate({ values, id, resource: "images" }),
            )}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="altText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image description</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe the image..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Add an alternative text to make the image accessible.
                  </FormDescription>
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

export function ImageManager({ onRefresh }) {
  const columns = useMemo(
    () => [
      {
        id: "altText",
        header: "Image",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Image
                src={`${api.defaults.baseURL}${row.original.url}`}
                className="shrink-0 size-[40px] object-cover rounded-sm border"
              />
              <span
                className={cn(
                  "truncate",
                  row.original.altText || "text-muted-foreground",
                )}
              >
                {row.original.altText ?? "No description"}
              </span>
            </div>
          );
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Upload date",
        cell: ({ getValue }) =>
          formatDate(new Date(getValue()), "dd/MM/yyyy HH:mm:ss"),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <AltTextPopover
              id={row.original.id}
              defaultValue={row.original.altText}
              onSuccess={onRefresh}
            />
            <DeleteButton
              variant="ghost"
              size="icon"
              resource="images"
              recordItemId={row.original.id}
              onSuccess={onRefresh}
            >
              <Trash />
            </DeleteButton>
          </>
        ),
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
    refineCore: {
      tableQuery: { refetch },
    },
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

      await refetch();
      await onRefresh();
    }
  };

  return (
    <div className="grid @2xl:grid-cols-[40%_60%] gap-4">
      <div className="flex flex-col justify-between gap-2">
        <DropZone
          control={uploadForm.control}
          name="images"
          maxFiles={5}
          maxSize={5_000_000}
          accepts={{ "images/*": [] }}
        />
        <Button onClick={uploadForm.handleSubmit(onSubmit)} className="w-full">
          Submit
        </Button>
      </div>
      <div>
        <DataTable table={table} />
      </div>
    </div>
  );
}
