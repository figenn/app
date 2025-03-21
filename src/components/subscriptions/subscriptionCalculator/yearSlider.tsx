"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface YearSliderProps {
  years: number;
  onYearsChange: (years: number) => void;
  isLoading: boolean;
  t: (key: string) => string;
}

function YearSlider({ years, onYearsChange, isLoading, t }: YearSliderProps) {
  return (
    <div className="space-y-4">
      <Label>
        {t("calculator.time_period")} / {t("calculator.year")}: {years}
      </Label>
      <Slider
        value={[years]}
        onValueChange={(value) => onYearsChange(value[0])}
        max={20}
        min={1}
        step={1}
        className="w-full"
        disabled={isLoading}
      />
    </div>
  );
}

export default YearSlider;
