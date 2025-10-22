import { ChevronsUpDown, ImagePlus, ImageUp } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useInfiniteList } from "@refinedev/core";
import { LoadingOverlay } from "./refine-ui/layout/loading-overlay";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ImageManager } from "./image-manager";
import { Command, CommandGroup, CommandInput, CommandList, CommandItem } from "./ui/command";
import { api } from "@mint-boutique/axios-client";
import { FormField } from "./ui/form";

export function ImagePicker({ control, name, maxFiles }) {
  const {
    query: { isLoading },
    result: { data },
  } = useInfiniteList({
    resource: "images",
    pagination: {
      pageSize: 10,
    },
  });

  const images = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <FormField
      control={control}
      name={name}
      defaultValues={[]}
      render={({ field }) => (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <ImagePlus />
                Add {maxFiles} images...
                <ChevronsUpDown className="ml-auto" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-max p-0">
              <Command>
                <CommandInput placeholder="Search images..." />
                <CommandList>
                  <CommandGroup>
                    {images.map((image) => {
                      const imageUrl = `${api.defaults.baseURL}${image.url}`;
                      return (
                        <CommandItem
                          key={image.id}
                          value={image.altText ?? ""}
                          onSelect={() => {
                            if (field.value.includes(imageUrl)) {
                              field.onChange(field.value.filter((url) => url !== imageUrl));
                            } else {
                              field.onChange([...field.value, imageUrl]);
                            }
                          }}
                        >
                          <img src={imageUrl} alttext={image.altText ?? image.id} className="apsect-square object-cover size-[40px] rounded" />
                          {image.altText ?? <span className="opacity-75">No description</span>}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full">
                    <ImageUp />
                    Manage images
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[1200px]">
                  <DialogHeader>
                    <DialogTitle>Manage images</DialogTitle>
                    <DialogDescription>Upload, change description and delete images</DialogDescription>
                  </DialogHeader>
                  <ImageManager />
                </DialogContent>
              </Dialog>
            </PopoverContent>
          </Popover>
          <ScrollArea className="w-full rounded-md border">
            <div className="flex gap-2 p-4 h-[200px]">
              {field.value.map((url) => (
                <img src={url} className="rounded-sm" />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </>
      )}
    />
  );
}
