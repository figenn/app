"use client";

import { CircleDollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "../../ui/loader";
import { useCurrencyLocale } from "@/hooks/useCurrencyLocale";
import { useTranslations } from "next-intl";

interface SubscriptionGaugeProps {
  data: number;
  isLoading: boolean;
  error: string | null;
}

export default function SubscriptionGauge({
  data: annualCost = 0,
  isLoading,
  error,
}: SubscriptionGaugeProps) {
  const monthlyCost = annualCost ? annualCost / 12 : 0;
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const currency = useCurrencyLocale(navigator.language);
  const t = useTranslations("subscription.gauge");

  useEffect(() => {
    if (!isLoading && !error && annualCost) {
      const targetPercentage = Math.min((monthlyCost / 200) * 100, 100);
      setAnimatedPercentage(0);

      const animateCircle = () => {
        setAnimatedPercentage(0);
        setTimeout(() => {
          requestAnimationFrame(() => {
            setAnimatedPercentage(targetPercentage);
          });
        }, 50);
      };

      animateCircle();
    }
  }, [isLoading, error, annualCost, monthlyCost]);

  return (
    <Card className="w-[25vw] h-[300px] overflow-hidden">
      <CardContent className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8">
          <CircleDollarSign className="h-5 w-5" />
          <span className="text-base font-medium">{t("monthly_cost")}</span>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-destructive">
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center relative">
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 rounded-full border-[16px] border-muted/20"></div>
                <svg
                  className="absolute inset-0 h-full w-full -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="8"
                    strokeDasharray={`${animatedPercentage * 2.64} 1000`}
                    strokeLinecap="round"
                    style={{
                      transition:
                        "stroke-dasharray 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-md font-bold text-orange-500">
                    {monthlyCost.toFixed(2)}
                    {currency}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("per_month")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-base text-muted-foreground">
                  {t("annual_cost")}
                </span>
                <span className="text-base font-medium">
                  {annualCost.toFixed(2)}
                  {currency}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
