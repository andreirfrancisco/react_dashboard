import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the props interface
interface TabsProps {
  array: string[]; // Array of tabs
  onTabChange: (value: string) => void; // Callback function for tab change
}

export function Tabs({ array, onTabChange }: TabsProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("");

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue); // Update local state
    onTabChange(newValue); // Notify parent about the tab change
    setOpen(false); // Close the popover
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[355px] justify-between m-2"
        >
          {value ? value : "Select item..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0 bg-black text-white">
        <Command>
          <CommandInput placeholder="Search Table..." className="h-9" />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {array.map((item, index) => (
                <CommandItem
                  key={`${item}-${index}`}
                  value={item}
                  onSelect={() => handleSelect(item)}
                >
                  {item}
                  <Check className={cn("ml-auto", value === item ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
