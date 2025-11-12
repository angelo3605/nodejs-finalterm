import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
import { useState } from "react";
import { Badge } from "@/components/ui/badge.jsx";
import { X } from "lucide-react";
import { cn } from "@/lib/utils.js";

export function TagsInput({ control, name, label, disabled, className }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const [input, setInput] = useState("");

        const addTag = (tag) => {
          const _tag = tag.trim();
          if (_tag && !field.value.includes(_tag)) {
            field.onChange(field.value.concat(_tag));
          }
        };

        const removeTag = (tag) =>
          field.onChange(field.value.filter((_tag) => _tag !== tag));

        const handleKeyDown = (e) => {
          if (["Enter", ","].includes(e.key)) {
            e.preventDefault();
            addTag(input);
            setInput("");
          } else if (e.key === "Backspace" && !input) {
            removeTag(field.value.at(-1));
          }
        };

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="dark:bg-input/30 border rounded-md shadow-xs focus-within:ring-3 focus-within:border-primary ring-primary/40 flex flex-wrap items-center">
                {field.value?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full my-1.5 mx-0.25 first:ml-1.5 cursor-pointer hover:brightness-75 dark:hover:brightness-200"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="ml-0.5" />
                  </Badge>
                ))}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type and enter..."
                  className={cn(
                    "outline-none flex-1 h-9 text-sm px-3",
                    field.value?.length && "px-1.5",
                  )}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}