"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";

import { calculateCosts } from "@/utils/calculateCosts";
import PriceInput from "./priceInput";
import YearSlider from "./yearSlider";
import CostDisplay from "./costDisplay";
import SubscriptionChart from "./subscriptionChart";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchSubscriptionData = async (bearer: string | undefined) => {
  const response = await fetch(`${API_URL}/subscriptions/calculate?year=2025`, {
    headers: {
      Authorization: `Bearer ${bearer}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch subscription data: ${response.status}`);
  }

  return await response.json();
};

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

function SubscriptionCalculator({ bearer }: { bearer: string | undefined }) {
  const isMobile = useIsMobile();
  const [years, setYears] = useQueryState(
    "years",
    parseAsInteger.withDefault(5)
  );
  const [manualPrice, setManualPrice] = useState<number | null>(null);
  const [data, setData] = useState<
    {
      year: number;
      cost: number;
      cost10: number;
      cost20: number;
      cost30: number;
    }[]
  >([]);
  const t = useTranslations("subscription");

  const {
    data: subscriptionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscriptionData", bearer],
    queryFn: () => fetchSubscriptionData(bearer),
    retry: 2,
  });

  const defaultMonthlyPrice = subscriptionData
    ? Number((subscriptionData / 12).toFixed(2))
    : 0;

  const effectivePrice =
    manualPrice !== null ? manualPrice : defaultMonthlyPrice;

  const handlePriceChange = (price: number) => {
    setManualPrice(price);
  };

  const resetToDefaultPrice = () => {
    setManualPrice(null);
  };

  useEffect(() => {
    const calculatedCosts = calculateCosts(effectivePrice, years);
    setData(calculatedCosts);
  }, [effectivePrice, years]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("calculator.title")}</CardTitle>
        {error ? <p className="text-red-500">{t("common.error")}</p> : null}
      </CardHeader>
      <CardContent>
        <div
          className={`grid gap-8 ${
            isMobile ? "grid-cols-1" : "lg:grid-cols-2"
          }`}
        >
          <div className="space-y-6">
            <PriceInput
              price={effectivePrice}
              onPriceChange={handlePriceChange}
              onReset={resetToDefaultPrice}
              t={t}
            />
            <YearSlider
              years={years}
              onYearsChange={setYears}
              isLoading={isLoading}
              t={t}
            />
            <CostDisplay price={effectivePrice} years={years} t={t} />
          </div>

          <div className={isMobile ? "h-[200px]" : "h-[300px]"}>
            <SubscriptionChart
              data={data}
              isLoading={isLoading}
              isMobile={isMobile}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SubscriptionCalculator;
