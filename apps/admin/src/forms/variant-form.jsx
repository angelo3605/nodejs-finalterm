import { ComboBox } from "@/components/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { useSelect } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function VariantForm({ refineForm }) {
  const {
    refineCore: { onFinish, formLoading, query },
    ...form
  } = refineForm;

  const { options: products } = useSelect({
    resource: "products",
    optionLabel: "name",
    optionValue: "slug",
    defaultValue: query?.data?.data.productSlug,
  });

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
        <div className="grid grid-cols-2 gap-2">
          <ComboBox
            control={form.control}
            name="productSlug"
            options={products}
            label="Product"
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variant name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter variant name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput
                      placeholder="Give a reasonable price!"
                      {...field}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>VND</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock quantity</FormLabel>
                <FormControl>
                  <Input placeholder="What's left?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
