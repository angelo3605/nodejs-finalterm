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

export function CategoryForm({ refineForm }) {
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
        <div className="grid items-start gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ImagePicker
            control={form.control}
            name="imageUrl"
            label="Image"
            maxFiles={1}
          />
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description..." {...field} />
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
