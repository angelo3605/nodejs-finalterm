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
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
import { Image } from "@/components/image.jsx";
import { formatDate } from "date-fns";
import { Spinner } from "@/components/ui/spinner.jsx";

// TODO: Array checking is rudimentary. Will improve later

function ImagePreviews({ imageUrls, onClick, disabled, isLoading }) {
  const urls = [].concat(imageUrls).filter(Boolean);
  return (
    <ScrollArea
      className={cn(
        "min-w-1 w-full rounded-md border",
        disabled && "opacity-75",
      )}
    >
      <>
        <div className="flex gap-2 p-2 h-40">
          {isLoading ? (
            <Spinner className="size-8 opacity-50 self-center mx-auto" />
          ) : urls.length ? (
            urls.map((url, i) => (
              <button
                key={i}
                onClick={() => onClick(url)}
                disabled={disabled}
                className="group relative flex justify-end p-2 cursor-pointer aspect-square rounded-sm overflow-hidden disabled:cursor-not-allowed border"
              >
                <Image
                  src={url}
                  className="absolute w-full h-full top-0 left-0 object-cover pointer-events-none"
                />
                <X className="box-content size-5 p-1 text-white bg-black/33 rounded-full opacity-100 group-[:not(:hover),:disabled]:opacity-0 transition z-10" />
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
      <DialogContent className="@container md:w-[calc(100%-2rem)] max-w-full sm:max-w-[1200px]">
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

export function ImagePicker({
  control,
  name,
  maxFiles,
  label,
  className,
  disabled,
}) {
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
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="space-y-2 min-w-0 ">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full max-w-60"
                    disabled={disabled}
                  >
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
                              <Image
                                src={imageUrl}
                                alttext={image.altText ?? image.id}
                                className="shrink-0 size-10 object-cover rounded-sm border"
                              />
                              <p className="truncate">
                                {image.altText ?? (
                                  <span className="opacity-75">
                                    No description
                                  </span>
                                )}
                                <br />
                                <span className="text-sm opacity-75">
                                  {formatDate(
                                    new Date(image.createdAt),
                                    "dd/MM/yyyy HH:mm:ss",
                                  )}
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
                disabled={disabled}
                isLoading={isLoading}
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
