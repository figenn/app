"use client";

import { CardDescription } from "@/components/ui/card";

import { CircleDollarSign } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "../ui/loader";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const isMobile = useIsMobile();

  // Format currency based on locale
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(navigator.language || "fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace(/\s/g, "");
  };

  useEffect(() => {
    if (!isLoading && !error && annualCost) {
      const targetPercentage = Math.min((monthlyCost / 200) * 100, 100);
      setAnimatedPercentage(0);

      const animateCircle = () => {
        setAnimatedPercentage(0);
        document.body.offsetHeight;
        setTimeout(() => {
          requestAnimationFrame(() => {
            setAnimatedPercentage(targetPercentage);
          });
        }, 50);
      };

      animateCircle();
    }
  }, [isLoading, error, annualCost, monthlyCost]);

  const getColorClass = () => {
    if (monthlyCost < 30) return "text-green-500";
    if (monthlyCost < 80) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressColor = () => {
    if (monthlyCost < 30) return "bg-green-500";
    if (monthlyCost < 80) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-full max-w-md mx-auto py-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 pt-1 text-base">
          <CircleDollarSign className="h-4 w-4" />
          Coût mensuel
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-destructive">
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div
              className={`relative flex items-center justify-center ${
                isMobile ? "h-32 w-32" : "h-36 w-36"
              }`}
            >
              {/* Circular background */}
              <div className="absolute inset-0 rounded-full border-8 border-muted"></div>

              {/* Circular progress with animation */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeDasharray={`${animatedPercentage * 2.89} 1000`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{
                    transition:
                      "stroke-dasharray 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </svg>

              {/* Cost display */}
              <div className="text-center z-10">
                <p
                  className={`${
                    isMobile ? "text-2xl" : "text-xl"
                  } font-bold ${getColorClass()}`}
                >
                  {formatCurrency(monthlyCost)}
                </p>
                <p className="text-xs text-muted-foreground">par mois</p>
              </div>
            </div>

            {!isMobile && (
              <div className="mt-4 w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Coût annuel
                  </span>
                  <span className="font-medium">
                    {formatCurrency(annualCost)}
                  </span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={getProgressColor()}
                    style={{
                      width: `${animatedPercentage}%`,
                      height: "100%",
                      transition:
                        "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-green-500">Économique</span>
                  <span className="text-orange-500">Modéré</span>
                  <span className="text-red-500">Élevé</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
