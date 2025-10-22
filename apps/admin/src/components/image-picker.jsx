import { useInfiniteList } from "@refinedev/core";
import { api } from "@mint-boutique/axios-client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { FormField } from "./ui/form";
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
} from "lucide-react";
import { ImageManager } from "./image-manager";

function ImagePreviews({ imageUrls }) {
  return (
    <ScrollArea className="w-full rounded-md border">
      <>
        <div className="flex gap-2 p-2 h-50">
          {imageUrls.length > 0 ? (
            imageUrls.map((url) => (
              <img src={url} className="rounded-xs border" />
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

export function ImagePicker({ control, name, maxFiles }) {
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
        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
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
                      const checked = field.value.includes(imageUrl);

                      const handleSelect = () => {
                        let newImageUrls;

                        if (checked) {
                          newImageUrls = field.value.filter(
                            (url) => url !== imageUrl,
                          );
                        } else {
                          newImageUrls = [...field.value, imageUrl];
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
                            className="size-[40px] object-cover rounded-xs border"
                          />
                          <p className="truncate">
                            {image.altText ?? (
                              <span className="opacity-75">No description</span>
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
                <ImageManagerDialog onRefresh={async () => await refetch()} />
              </div>
            </PopoverContent>
          </Popover>
          <ImagePreviews imageUrls={field.value} />
        </div>
      )}
    />
  );
}
