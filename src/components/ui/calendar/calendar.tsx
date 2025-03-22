"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/interfaces/Subscription";
import {
  getCalendarDays,
  getNextMonth,
  getPrevMonth,
  getSubscriptionOccurrencesInMonth,
} from "@/utils/calendarUtils";
import { useIsMobile } from "@/hooks/useIsMobile";
import CalendarHeader from "./calendarHeader";
import CalendarDay from "./calendarDay";
import { useLocale } from "next-intl";
import { CalendarProps } from "@/interfaces/Calendar";

const Calendar = ({
  subscriptions,
  className,
  currentMonth,
  setCurrentMonth,
  isLoading = false,
  size = "medium",
}: CalendarProps) => {
  const [today] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const isMobile = useIsMobile();
  const locale = useLocale();

  const calendarDays = getCalendarDays(currentMonth);
  const daysOfWeek = getDaysOfWeek(locale, isMobile);

  useEffect(() => {
    if (!subscriptions || !Array.isArray(subscriptions)) {
      setEvents([]);
      return;
    }

    const monthEvents = subscriptions.flatMap((subscription) =>
      getSubscriptionOccurrencesInMonth(subscription, currentMonth)
    );
    setEvents(monthEvents);
  }, [subscriptions, currentMonth]);

  const handleMonthChange = (direction: "next" | "prev") => {
    setCurrentMonth(
      direction === "next"
        ? getNextMonth(currentMonth)
        : getPrevMonth(currentMonth)
    );
  };

  return (
    <div
      className={cn(
        "rounded-lg p-2 sm:p-3 md:p-5 bg-primary-foreground border shadow-md overflow-hidden flex flex-col",
        "bg-card text-card-foreground transition-colors duration-200",
        className
      )}
    >
      <CalendarHeader
        currentMonth={currentMonth}
        onNextMonth={() => handleMonthChange("next")}
        onPrevMonth={() => handleMonthChange("prev")}
        locale={locale}
      />
      <DaysOfWeekHeader days={daysOfWeek} />
      <CalendarGrid
        days={calendarDays}
        currentMonth={currentMonth}
        today={today}
        events={events}
        isLoading={isLoading}
        size={size}
        isMobile={isMobile}
      />
    </div>
  );
};

const getDaysOfWeek = (locale: string, isMobile: boolean) => {
  return Array(7)
    .fill(null)
    .map((_, i) => {
      const day = new Date(Date.UTC(2023, 0, 2 + i));
      return new Intl.DateTimeFormat(locale, {
        weekday: isMobile ? "narrow" : "short",
      }).format(day);
    });
};

const DaysOfWeekHeader = ({ days }: { days: string[] }) => (
  <div className="grid grid-cols-7 border-b dark:border-slate-700">
    {days.map((day, index) => (
      <div
        key={`day-of-week-${index}`}
        className="py-1 sm:py-2 md:py-3 text-center text-xs sm:text-sm font-medium text-muted-foreground"
      >
        {day}
      </div>
    ))}
  </div>
);

const CalendarGrid = ({
  days,
  currentMonth,
  today,
  events,
  isLoading,
  size,
  isMobile,
}: {
  days: Date[];
  currentMonth: Date;
  today: Date;
  events: CalendarEvent[];
  isLoading: boolean;
  size: "small" | "medium";
  isMobile: boolean;
}) => (
  <div
    className="grid grid-cols-7 flex-1 divide-x divide-y dark:divide-slate-700"
    style={{
      gridAutoRows: isMobile
        ? "min-content"
        : size === "small"
        ? "80px"
        : "150px",
    }}
  >
    {days.map((day) => (
      <CalendarDay
        key={day.toString()}
        day={day}
        currentMonth={currentMonth}
        today={today}
        events={events}
        isLoading={isLoading}
        calendarSize={size}
      />
    ))}
  </div>
);

export default Calendar;
