"use client";

import { useQuery } from "@tanstack/react-query";
import { format, getWeek, parseISO } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { CalendarDays, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Subscription } from "@/interfaces/Subscription";
import { useTranslations, useLocale } from "next-intl";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getCurrentWeek(): number {
  const today = new Date();
  const weekNumber = getWeek(today, {
    weekStartsOn: 1,
    firstWeekContainsDate: 4,
  });

  return weekNumber;
}

function groupSubscriptionsByDate(
  subscriptions: Subscription[]
): Record<string, Subscription[]> {
  return subscriptions.reduce((acc, subscription) => {
    const date = subscription.start_date.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(subscription);
    return acc;
  }, {} as Record<string, Subscription[]>);
}

function SubscriptionItem({ subscription }: { subscription: Subscription }) {
  const bgColor = subscription.color ? subscription.color : "#4f46e5";

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{
            backgroundColor: subscription.logo_url ? "white" : bgColor,
            boxShadow: subscription.logo_url
              ? "0 1px 3px rgba(0,0,0,0.1)"
              : "none",
          }}
        >
          {subscription.logo_url ? (
            <img
              src={subscription.logo_url || "/placeholder.svg"}
              alt={subscription.name}
              className="h-5 w-5 rounded-full object-contain"
            />
          ) : (
            <CreditCard className="h-3.5 w-3.5 text-white" />
          )}
        </div>
        <span className="text-sm font-medium">{subscription.name}</span>
      </div>
      {subscription.price > 0 && (
        <Badge
          variant="outline"
          style={{
            backgroundColor: `${bgColor}20`,
            color: bgColor,
            borderColor: `${bgColor}40`,
          }}
          className="text-xs font-medium"
        >
          {subscription.price.toFixed(2)} €
        </Badge>
      )}
    </div>
  );
}

function DateHeader({ date }: { date: string }) {
  const locale = useLocale();
  const t = useTranslations("subscription.widget_upcoming");

  const formattedDate = format(parseISO(date), "EEEE d MMM", {
    locale: locale === "fr" ? fr : enUS,
  });

  const isToday = new Date(date).toDateString() === new Date().toDateString();

  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
        <CalendarDays className="h-3.5 w-3.5 text-primary" />
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {formattedDate}
      </span>
      {isToday && (
        <Badge className="h-5 px-1.5 text-[10px]">{t("today")}</Badge>
      )}
    </div>
  );
}

export function UpcomingSubscriptionsWidget({
  bearer,
}: {
  bearer: string | undefined;
}) {
  const currentWeek = getCurrentWeek();
  const t = useTranslations("subscription.widget_upcoming");

  const fetchUpcomingSubscription = async ({
    week,
  }: {
    week: number;
  }): Promise<Subscription[]> => {
    const response = await fetch(
      `${API_URL}/subscriptions/upcoming?week=${week}`,
      {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des abonnements");
    }
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["upcomingSubscriptions", currentWeek],
    queryFn: () => fetchUpcomingSubscription({ week: currentWeek }),
  });

  const groupedSubscriptions = data ? groupSubscriptionsByDate(data) : {};
  const dates = Object.keys(groupedSubscriptions).sort();

  const totalAmount =
    data?.reduce((sum, sub) => sum + (sub.price || 0), 0) || 0;

  return (
    <Card className="w-[25vw] h-[300px] overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {t("upcoming_subscriptions")}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {t("week")} {currentWeek}
          </Badge>
        </div>
        <CardDescription className="text-xs flex justify-between items-center">
          <span> {t("next_payment")}</span>
          {data && !isLoading && (
            <span className="font-medium text-primary">
              {t("total")}: {totalAmount.toFixed(2)} €
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[220px] px-4 pb-4">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="ml-auto h-3 w-8" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              {t("error.loading")}
            </div>
          ) : dates.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              {t("error.no_subscriptions")}
            </div>
          ) : (
            <div className="space-y-4">
              {dates.map((date) => (
                <div key={date} className="space-y-1">
                  <DateHeader date={date} />
                  <div className="border-l-2 border-l-primary/20 pl-3 space-y-1">
                    {groupedSubscriptions[date].map((subscription) => (
                      <SubscriptionItem
                        key={subscription.id}
                        subscription={subscription}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
