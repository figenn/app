"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { generateCalendarDays } from "@/utils/calendarUtils";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SubscriptionCard from "./subscriptionCard";
import { useLocale, useTranslations } from "next-intl";
import { Skeleton } from "../ui/skeleton";
import { Dialog } from "@/components/ui/dialog";
import { SubscriptionModal } from "./createSubscriptionForm";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SubscriptionCalendar = ({ bearer }: { bearer: string | undefined }) => {
  const [date, setDate] = useState(new Date());
  const t = useTranslations("calendar");
  const locale = useLocale();

  const formattedDate = useMemo(
    () => ({
      month: date.toLocaleDateString(locale, { month: "long" }),
      year: date.getFullYear(),
    }),
    [date, locale]
  );

  const fetchSubscriptions = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/subscriptions/active?year=${date.getFullYear()}&month=${
          date.getMonth() + 1
        }`,
        {
          headers: { Authorization: `Bearer ${bearer}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch subscriptions");
      return response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [date, bearer]);

  const { data: subscriptions = [], isLoading } = useQuery({
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

  const navigateMonth = useCallback((increment: number) => {
    setDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + increment, 1)
    );
  }, []);

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CalendarIcon className="h-6 w-6 text-[#F89414] mr-2" />
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

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }, (_, day) => (
          <div key={day} className="text-center font-medium text-gray-600 py-2">
            {new Date(2023, 0, day + 1).toLocaleDateString(locale, {
              weekday: "short",
            })}
          </div>
        ))}
        {isLoading
          ? Array.from({ length: 42 }, (_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-md" />
            ))
          : calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-20 p-1 border rounded ${
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
                } ${day.isToday ? "ring-2 ring-[#F89414]" : ""}`}
              >
                <div className="flex justify-end">
                  <span
                    className={`text-sm font-medium ${
                      day.isToday
                        ? "h-6 w-6 rounded-full bg-[#F89414] text-white flex items-center justify-center"
                        : ""
                    }`}
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
    </Card>
  );
};

export default SubscriptionCalendar;
