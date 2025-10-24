import { useInfiniteList } from "@refinedev/core";
import { api } from "@mint-boutique/axios-client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "./ui/command";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import {
  BookImage,
  Check,
  ChevronsUpDown,
  ImageOff,
  ImagePlus,
  X,
} from "lucide-react";
import { ImageManager } from "./image-manager";

// TODO: Array checking is rudimentary. Will improve later

function ImagePreviews({ imageUrls, onClick }) {
  return (
    <ScrollArea className="w-full rounded-md border">
      <>
        <div className="flex gap-2 p-2 h-40">
          {imageUrls || (Array.isArray(imageUrls) && imageUrls.length > 0) ? (
            (Array.isArray(imageUrls) ? imageUrls : [imageUrls]).map((url) => (
              <button
                onClick={() => onClick(url)}
                className="group cursor-pointer relative"
              >
                <img
                  key={url}
                  src={url}
                  className="rounded-sm object-contain h-full"
                />
                <X className="box-content size-5 p-1 absolute top-2 right-2 text-white bg-black/33 rounded-full group-[:not(:hover)]:opacity-0 transition" />
              </button>
            ))
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageOff />
                </EmptyMedia>
                <EmptyTitle>No images</EmptyTitle>
                <EmptyDescription>
                  Select images by clicking the button above
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </>
    </ScrollArea>
  );
}

function ImageManagerDialog({ onRefresh }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          <BookImage />
          Manage images
        </Button>
      </DialogTrigger>
      <DialogContent className="@container w-[calc(100%-2rem)] sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Manage images</DialogTitle>
          <DialogDescription>
            Upload, change description and delete images
          </DialogDescription>
        </DialogHeader>
        <ImageManager onRefresh={onRefresh} />
      </DialogContent>
    </Dialog>
  );
}

export function ImagePicker({ control, name, maxFiles, label }) {
  const {
    query: { isLoading, refetch },
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
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-60">
                    <ImagePlus />
                    Add {maxFiles} images...
                    <ChevronsUpDown className="ml-auto" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search images..." />
                    <CommandList>
                      <CommandEmpty>No images</CommandEmpty>
                      <CommandGroup>
                        {images.map((image) => {
                          const imageUrl = `${api.defaults.baseURL}${image.url}`;
                          const checked =
                            field.value &&
                            (field.value === imageUrl ||
                              field.value.includes(imageUrl));

                          const handleSelect = () => {
                            let newImageUrls;
                            if (Array.isArray(field.value)) {
                              newImageUrls = checked
                                ? field.value.filter((url) => url !== imageUrl)
                                : (newImageUrls = [...field.value, imageUrl]);
                            } else {
                              newImageUrls = checked ? "" : imageUrl;
                            }
                            field.onChange(newImageUrls);
                          };

                          return (
                            <CommandItem
                              key={image.id}
                              value={image.altText ?? image.id}
                              onSelect={handleSelect}
                            >
                              <img
                                src={imageUrl}
                                alttext={image.altText ?? image.id}
                                className="shrink-0 size-[40px] object-cover rounded-sm"
                              />
                              <p className="truncate">
                                {image.altText ?? (
                                  <span className="opacity-75">
                                    No description
                                  </span>
                                )}
                                <br />
                                <span className="text-sm opacity-75">
                                  {image.createdAt}
                                </span>
                              </p>
                              <Check
                                className={cn(
                                  "ml-auto mr-2 text-inherit",
                                  checked || "opacity-0",
                                )}
                              />
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  <div className="p-2 border-t">
                    <ImageManagerDialog
                      onRefresh={async () => await refetch()}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <ImagePreviews
                imageUrls={field.value}
                onClick={(imageUrl) =>
                  field.onChange(
                    Array.isArray(field.value)
                      ? field.value.filter((url) => url !== imageUrl)
                      : "",
                  )
                }
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
