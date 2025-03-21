"use client";
import {
  DISCOUNT_10,
  DISCOUNT_20,
  DISCOUNT_30,
  MONTHS_IN_YEAR,
} from "@/utils/constants";
import React from "react";

interface CostDisplayProps {
  price: number;
  years: number;
  t: (key: string) => string;
}

function CostDisplay({ price, years, t }: CostDisplayProps) {
  return (
    <div className="pt-4 border-t space-y-2">
      <div className="text-2xl font-bold">
        {t("calculator.total_cost")}: €
        {(price * years * MONTHS_IN_YEAR).toFixed(2)}
      </div>
      <p className="text-sm text-muted-foreground">
        {t("calculator.over")} {years}{" "}
        {years === 1 ? t("calculator.year") : t("calculator.years")}
      </p>

      <div className="space-y-1 pt-2 mt-2 border-t">
        <p className="text-sm flex justify-between">
          <span className="flex items-center">
            <span
              className="inline-block w-3 h-3 mr-2"
              style={{ backgroundColor: "var(--color-chart-2)" }}
            ></span>
            <span>{t("calculator.discount")} 10%</span>
          </span>
          <span className="font-medium">
            €{(price * years * MONTHS_IN_YEAR * DISCOUNT_10).toFixed(2)}
          </span>
        </p>
        <p className="text-sm flex justify-between">
          <span className="flex items-center">
            <span
              className="inline-block w-3 h-3 mr-2"
              style={{ backgroundColor: "var(--color-chart-3)" }}
            ></span>
            <span>{t("calculator.discount")} 20%</span>
          </span>
          <span className="font-medium">
            €{(price * years * MONTHS_IN_YEAR * DISCOUNT_20).toFixed(2)}
          </span>
        </p>
        <p className="text-sm flex justify-between">
          <span className="flex items-center">
            <span
              className="inline-block w-3 h-3 mr-2"
              style={{ backgroundColor: "var(--color-chart-4)" }}
            ></span>
            <span>{t("calculator.discount")} 30%</span>
          </span>
          <span className="font-medium">
            €{(price * years * MONTHS_IN_YEAR * DISCOUNT_30).toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
}

export default CostDisplay;
