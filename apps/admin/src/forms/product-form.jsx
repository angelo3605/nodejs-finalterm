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
import { TiptapEditor } from "@/components/tiptap-editor";

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
        <div className="grid md:grid-cols-[2fr_3fr] gap-4">
          <div className="space-y-4">
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
            <ImagePicker
              control={form.control}
              name="imageUrls"
              maxFiles={10}
              label="Images"
            />
          </div>
          <div className="space-y-4">
            <TiptapEditor
              control={form.control}
              name="desc"
              label="Description"
              height={428}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
