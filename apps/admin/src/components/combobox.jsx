import { useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import {
  Command,
  CommandList,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "./ui/command";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { ChevronsUpDown, Check } from "lucide-react";

export function ComboBox({
  control,
  name,
  label,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  options,
  disabled,
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const [open, setOpen] = useState(false);

        const currentOption = options.find(
          (option) => option.value === field.value,
        );

        const handleSelect = (value) => {
          field.onChange(value);
          setOpen(false);
        };

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full"
                    disabled={disabled}
                  >
                    {currentOption?.label ?? placeholder ?? "Select an item..."}
                    <ChevronsUpDown className="ml-auto" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder={searchPlaceholder ?? "Search"} />
                    <CommandList>
                      <CommandEmpty>
                        {emptyLabel ?? "Wow, such empty"}
                      </CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={handleSelect}
                          >
                            {option.label}
                            <Check
                              className={cn(
                                "text-current ml-auto",
                                option.value !== field.value && "opacity-0",
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
  );
}
