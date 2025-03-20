"use client";

import Calendar from "@/components/ui/calendar/calendar";
import { Subscription } from "@/interfaces/Subscription";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SubscriptionModal } from "@/components/calendar/subscriptionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CalendarWidget({
  bearer,
}: {
  bearer: string | undefined;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const t = useTranslations("subscription.calendar");

  const fetchSubscriptions = async (date: Date): Promise<Subscription[]> => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const response = await fetch(
      `${API_URL}/subscriptions/active?year=${year}&month=${month}`,
      {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const { data: sampleSubscriptions, isLoading } = useQuery<
    Subscription[],
    Error
  >({
    queryKey: ["subscriptions", currentMonth.toISOString()],
    queryFn: () => fetchSubscriptions(currentMonth),
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-[90%]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold">
              {t("title")}
            </CardTitle>
            <SubscriptionModal bearer={bearer} currentMonth={currentMonth} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Calendar
            subscriptions={sampleSubscriptions || []}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            isLoading={isLoading}
            size={"small"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
