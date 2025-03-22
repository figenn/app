"use client";

import { useQuery } from "@tanstack/react-query";
import SubscriptionGauge from "./subscription-progress";
import { UpcomingSubscriptionsWidget } from "./upcomingSubscriptions";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function WidgetRow({ bearer }: { bearer: string | undefined }) {
  const year = new Date().getFullYear();

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscriptionCost", year],
    queryFn: async () => {
      const response = await fetch(
        `${apiUrl}/subscriptions/calculate?year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${bearer}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
      const cost = await response.json();
      return typeof cost === "number" ? cost : Number.parseFloat(cost);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center md:flex-row gap-10">
      <SubscriptionGauge
        data={data ?? 0}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
      />
      <UpcomingSubscriptionsWidget bearer={bearer} />
      <UpcomingSubscriptionsWidget bearer={bearer} />
    </div>
  );
}
