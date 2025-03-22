"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  currentMonth: Date;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  locale: string;
}

const CalendarHeader = ({
  currentMonth,
  onNextMonth,
  onPrevMonth,
  locale,
}: CalendarHeaderProps) => {
  const monthYearFormat = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between mb-2 sm:mb-4">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold">
        {monthYearFormat.format(currentMonth)}
      </h2>
      <div className="flex space-x-1 sm:space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 sm:h-9 sm:w-9"
          onClick={onPrevMonth}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Previous month</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 sm:h-9 sm:w-9"
          onClick={onNextMonth}
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
