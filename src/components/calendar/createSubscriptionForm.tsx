"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  formSubscriptionSchema,
  type SubscriptionFormValues,
} from "@/schemas/subscription";
import SearchService from "./search-service";
import { toast } from "sonner";
import ColorPicker from "./colorPicker";
import BillingCycleSelect from "./billingCycle";
import { format } from "date-fns";
import { useDateLocale } from "@/hooks/useDateLocale";
import { CategoriePicker } from "@/utils/categorieUtils";
import { useTranslations } from "next-intl";
import { useCurrencyLocale } from "@/hooks/useCurrencyLocale";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function SubscriptionModal({ bearer }: { bearer: string | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const dateLocale = useDateLocale();
  const currency = useCurrencyLocale(navigator.language);
  const t = useTranslations("subscription.form");
  console.log(navigator.language);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(formSubscriptionSchema),
    defaultValues: {
      name: "",
      category: "",
      color: "#f9a5a5",
      description: "",
      price: 0,
      billing_cycle: "monthly",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SubscriptionFormValues) => {
      const response = await fetch(`${API_URL}/subscriptions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'abonnement");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Abonnement créé avec succès !");
      setIsOpen(false);
      form.reset();
      setSelectedLogo(null);
    },
    onError: () => {
      toast.error("Erreur lors de la création de l'abonnement");
    },
  });

  function onSubmit(values: SubscriptionFormValues) {
    const startDate = new Date(form.getValues("start_date"));
    const startDateUTC = startDate.toISOString();
    form.setValue("start_date", startDateUTC);
    mutation.mutate(values);
  }

  function handleServiceSelect(service: { name: string; photo: string }) {
    form.setValue("name", service.name);
    form.setValue("logo_url", service.photo);
    setSelectedLogo(service.photo);
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">
                {t("new_subscription")}
              </DialogTitle>
            </div>
            <DialogDescription>{t("second_title")}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="px-6">
                <SearchService onSelect={handleServiceSelect} />
              </div>

              <Separator />

              <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 md:col-span-2">
                  {selectedLogo && (
                    <div className="h-12 w-12 mt-2 rounded-md overflow-hidden border flex-shrink-0 bg-card flex items-center justify-center">
                      <img
                        src={selectedLogo || "/placeholder.svg"}
                        alt="Logo"
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Netflix, Spotify, ..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("category")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CategoriePicker.map((category) => (
                                  <SelectItem
                                    key={category.value}
                                    value={category.value}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span>{category.icon}</span>
                                      <span>{category.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <ColorPicker form={form} />
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>{t("description")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("description_placeholder")}
                          className="resize-none min-h-[60px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("start_date")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP", {
                                  locale: dateLocale,
                                })
                              ) : (
                                <span className="text-muted-foreground">
                                  {t("select_date")}
                                </span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const localDate = new Date(
                                  date.getTime() -
                                    date.getTimezoneOffset() * 60000
                                );
                                field.onChange(localDate.toISOString());
                                console.log(localDate);
                              }
                            }}
                            initialFocus
                            locale={dateLocale}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("price")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            className="pl-7"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {currency}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <BillingCycleSelect form={form} />
              </div>

              <div className="bg-muted/40 px-6 py-4 flex items-center justify-end border-t">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("loading")}
                    </>
                  ) : (
                    t("button")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
