"use client";

import type { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarClock, CalendarDays, CalendarRange } from "lucide-react";
import { useTranslations } from "next-intl";

interface BillingCycleSelectProps {
  form: {
    control: Control<any>;
  };
}

const billingOptions = [
  {
    value: "monthly",
    label: "billing_month",
    description: "billing_month_detail",
    icon: CalendarDays,
  },
  {
    value: "quarterly",
    label: "billing_quarter",
    description: "billing_quarter_detail",
    icon: CalendarRange,
  },
  {
    value: "annual",
    label: "billing_year",
    description: "billing_year_detail",
    icon: CalendarClock,
  },
];

export default function BillingCycleSelect({ form }: BillingCycleSelectProps) {
  const t = useTranslations("subscription.form");
  return (
    <div className="md:col-span-2">
      <FormField
        control={form.control}
        name="billing_cycle"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>{t("billing_cycle")}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-3 gap-4"
              >
                {billingOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.value}>
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={option.value}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Icon className="mb-3 h-6 w-6" />
                        <div className="text-center">
                          <p className="font-medium">{t(option.label)}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t(option.description)}
                          </p>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
