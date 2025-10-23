import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImagePicker } from "@/components/image-picker";
import { useSelect } from "@refinedev/core";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm({ refineForm }) {
  const {
    refineCore: { onFinish, formLoading, query },
    ...form
  } = refineForm;

  const { options: brands } = useSelect({
    resource: "brands",
    optionLabel: "name",
    optionValue: "slug",
    defaultValue: query?.data?.data.brand.slug,
  });

  const { options: categories } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "slug",
    defaultValue: query?.data?.data.category.slug,
  });

  useEffect(() => {
    form.setValue("brand", query?.data?.data.brand.slug);
    form.setValue("category", query?.data?.data.category.slug);
  }, [brands, categories]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onFinish(values))}
        className="space-y-4"
      >
        <Button type="submit">Confirm</Button>
        <div className="grid grid-cols-[30%_70%] gap-4">
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => {
                const [open, setOpen] = useState(false);

                const currentBrand = brands.find(
                  (brand) => brand.value === field.value,
                );

                const handleSelect = (value) => {
                  field.onChange(value);
                  setOpen(false);
                };

                return (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full"
                          >
                            {currentBrand?.label ?? "Select brand..."}
                            <ChevronsUpDown className="ml-auto" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Search brand..." />
                            <CommandList>
                              <CommandEmpty>No brands found.</CommandEmpty>
                              <CommandGroup>
                                {brands.map((brand) => (
                                  <CommandItem
                                    key={brand.value}
                                    value={brand.value}
                                    onSelect={handleSelect}
                                  >
                                    {brand.label}
                                    <Check
                                      className={cn(
                                        "text-current ml-auto",
                                        brand.value !== field.value &&
                                          "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => {
                const [open, setOpen] = useState(false);

                const currentCategory = categories.find(
                  (category) => category.value === field.value,
                );

                const handleSelect = (value) => {
                  field.onChange(value);
                  setOpen(false);
                };

                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full"
                          >
                            {currentCategory?.label ?? "Select category..."}
                            <ChevronsUpDown className="ml-auto" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Search category..." />
                            <CommandList>
                              <CommandEmpty>No categories found.</CommandEmpty>
                              <CommandGroup>
                                {categories.map((category) => (
                                  <CommandItem
                                    key={category.value}
                                    value={category.value}
                                    onSelect={handleSelect}
                                  >
                                    {category.label}
                                    <Check
                                      className={cn(
                                        "text-current ml-auto",
                                        category.value !== field.value &&
                                          "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ImagePicker
              control={form.control}
              name="imageUrls"
              maxFiles={10}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
