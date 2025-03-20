"use client";

import { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { Control } from "react-hook-form";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const presetColors = [
  "#f9a5a5", // pastel red
  "#f7bb7f", // pastel orange
  "#f7d277", // pastel amber
  "#b6f798", // pastel lime
  "#7fe4c7", // pastel emerald
  "#7de0e7", // pastel cyan
  "#90c6f7", // pastel blue
  "#a5a8f3", // pastel indigo
  "#c5a8f7", // pastel violet
  "#f7a7df", // pastel fuchsia
  "#f7a9cb", // pastel pink
  "#a0b3c4", // pastel slate
];
interface ColorPickerProps {
  form: {
    control: Control<{
      color: string;
      name: string;
      billing_cycle: "monthly" | "quarterly" | "annual";
      start_date: string;
      price: number;
      category?: string;
      description?: string;
      logo_url?: string;
    }>;
  };
}
export default function ColorPicker({ form }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const t = useTranslations("subscription.form");

  useEffect(() => {
    const subscription = form.control._formState.defaultValues?.color;
    if (subscription) {
      setSelectedColor(subscription);
    }
  }, [form.control._formState.defaultValues?.color]);

  return (
    <FormField
      control={form.control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("color")}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between border-input",
                    !selectedColor && "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: selectedColor || "#000000" }}
                    />
                    <span>{selectedColor || t("chooseColor")}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="grid grid-cols-6 gap-2 mb-3">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      field.value === color && "ring-2 ring-offset-2 ring-ring"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      field.onChange(color);
                      setSelectedColor(color);
                      setOpen(false);
                    }}
                  >
                    {field.value === color && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-full border"
                    style={{ backgroundColor: field.value }}
                  />
                  <Input
                    type="color"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setSelectedColor(e.target.value);
                    }}
                    className="h-8 w-full"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
