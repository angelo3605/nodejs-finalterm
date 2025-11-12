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
import { Spinner } from "@/components/ui/spinner";
import { useSelect } from "@refinedev/core";
import { useEffect } from "react";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TagsInput } from "@/components/tags-input.jsx";

export function ProductForm({ refineForm }) {
  const {
    refineCore: { onFinish, formLoading, query },
    ...form
  } = refineForm;

  const { brand, category } = query?.data?.data ?? {};

  const {
    options: brands,
    query: { isLoading: isBrandLoading },
  } = useSelect({
    resource: "brands",
    optionLabel: "name",
    optionValue: "slug",
    defaultValue: brand?.slug,
  });

  const {
    options: categories,
    query: { isLoading: isCategoryLoading },
  } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "slug",
    defaultValue: category?.slug,
  });

  useEffect(() => {
    form.setValue("brand", brand?.slug);
    form.setValue("category", category?.slug);
  }, [brands, categories]);

  const isLoading = formLoading || isBrandLoading || isCategoryLoading;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onFinish(values))}
        className="space-y-4"
      >
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner />}
          Confirm
        </Button>
        <div className="grid @xl:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isFeatured"
            disabled={isLoading}
            render={({ field }) => (
              <div className="flex items-center space-x-2 @xl:col-span-2">
                <Switch
                  id="isFeatured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem className="@xl:col-span-2">
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
            disabled={isLoading}
          />
          <ComboBox
            control={form.control}
            name="brand"
            options={brands}
            label="Brand"
            disabled={isLoading}
          />
          <TagsInput
            control={form.control}
            name="tags"
            label="Tags"
            className="@xl:col-span-2"
            disabled={isLoading}
          />
          <ImagePicker
            control={form.control}
            name="imageUrls"
            maxFiles={10}
            label="Images"
            className="@xl:col-span-2"
            disabled={isLoading}
          />
          <TiptapEditor
            control={form.control}
            name="desc"
            label="Description"
            height={428}
            className="@xl:col-span-2"
            disabled={isLoading}
            placeholder={"Write something!"}
          />
        </div>
      </form>
    </Form>
  );
}
