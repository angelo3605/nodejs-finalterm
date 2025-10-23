import { ComboBox } from "@/components/combobox";
import { ImagePicker } from "@/components/image-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useSelect } from "@refinedev/core";
import { useEffect } from "react";

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
        <Button type="submit" disabled={formLoading}>
          {formLoading && <Spinner />}
          Confirm
        </Button>
        <ImagePicker
          control={form.control}
          name="imageUrls"
          maxFiles={10}
          label="Images"
        />
        <div className="grid grid-cols-[1fr_2fr] gap-4">
          <div className="flex flex-col gap-4">
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
            <ComboBox
              control={form.control}
              name="category"
              options={categories}
              label="Category"
            />
            <ComboBox
              control={form.control}
              name="brand"
              options={brands}
              label="Brand"
            />
          </div>
          <div className="flex flex-col gap-4">
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
          </div>
        </div>
      </form>
    </Form>
  );
}
