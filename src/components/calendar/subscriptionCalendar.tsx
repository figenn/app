"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { generateCalendarDays } from "@/utils/calendarUtils";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SubscriptionModal } from "./createSubscriptionForm";
import SubscriptionCard from "./subscriptionCard";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SubscriptionCalendar = ({ bearer }: { bearer: string | undefined }) => {
  const [date, setDate] = useState(new Date());
  const locale = useLocale();
  const t = useTranslations("calendar");

  const formattedDate = useMemo(
    () => ({
      month: date.toLocaleDateString(locale, { month: "long" }),
      year: date.getFullYear(),
    }),
    [date, locale]
  );

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, day) =>
        new Date(2023, 0, ((day + 1) % 7) + 1).toLocaleDateString(locale, {
          weekday: "short",
        })
      ),
    [locale]
  );

  const fetchSubscriptions = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/subscriptions/active?year=${date.getFullYear()}&month=${
          date.getMonth() + 1
        }`,
        { headers: { Authorization: `Bearer ${bearer}` } }
      );
      if (!response.ok) throw new Error("Failed to fetch subscriptions");
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [date, bearer]);

  const {
    data: subscriptions = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["subscriptions", date.getFullYear(), date.getMonth()],
    queryFn: fetchSubscriptions,
  });

  const calendarDays = useMemo(
    () =>
      isLoading
        ? []
        : generateCalendarDays(
            date.getFullYear(),
            date.getMonth() + 1,
            subscriptions
          ),
    [date, subscriptions, isLoading]
  );

  const navigateMonth = useCallback(
    (increment: number) =>
      setDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + increment, 1)
      ),
    []
  );

  return (
    <Card>
      <CardHeader className="p-4 pb-0 md:p-6 md:pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-2xl font-bold">{t("title")}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(-1)}
              aria-label="Mois précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium px-2 min-w-32 text-center">
              {formattedDate.month} {formattedDate.year}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(1)}
              aria-label="Mois suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Dialog>
              <SubscriptionModal bearer={bearer} />
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-6 md:p-6">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="text-center font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
          {isLoading
            ? Array.from({ length: 42 }, (_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-md" />
              ))
            : calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "min-h-20 p-1 border rounded",
                    day.isCurrentMonth
                      ? "bg-background"
                      : "bg-muted/50 text-muted-foreground",
                    day.isToday && "ring-2 ring-primary"
                  )}
                >
                  <div className="flex justify-end">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        day.isToday &&
                          "h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                      )}
                    >
                      {day.date.getDate()}
                    </span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {day.subscriptions.map((subscription) => (
                      <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                      />
                    ))}
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCalendar;
