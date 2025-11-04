import { ComboBox } from "@/components/combobox";
import { ImagePicker } from "@/components/image-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

export function DiscountCodeForm({ refineForm }) {
  const {
    refineCore: { onFinish, formLoading, query },
    ...form
  } = refineForm;

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
        <div className="grid @xl:grid-cols-2 items-start gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="@xl:col-span-2">
                <FormLabel>Discount code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter discount code..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ComboBox
            control={form.control}
            name="type"
            label="Discount type"
            options={[
              { label: "Percentage", value: "PERCENTAGE" },
              { label: "Fixed", value: "FIXED" },
            ]}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input placeholder="Enter value..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="usageLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usage limit</FormLabel>
                <FormControl>
                  <Input
                    placeholder="How many times can it be used?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numOfUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of usage</FormLabel>
                <FormControl>
                  <Input placeholder="Only use when overriding!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem className="@xl:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a short description..."
                    {...field}
                  />
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
