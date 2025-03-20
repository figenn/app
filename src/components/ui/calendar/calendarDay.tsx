import { isSameMonth, isSameDay, format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/interfaces/Subscription";
import { useIsMobile } from "@/hooks/useIsMobile";
import EventItem from "./eventItem";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDayProps } from "@/interfaces/Calendar";

const CalendarDay = ({
  day,
  currentMonth,
  today,
  events,
  isLoading = false,
  calendarSize = "medium",
}: CalendarDayProps) => {
  const inCurrentMonth = isSameMonth(day, currentMonth);
  const isToday = isSameDay(day, today);
  const dayEvents = events.filter((event) => isSameDay(event.displayDate, day));
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "group min-h-[60px] h-full border-r border-b p-1 transition-all overflow-hidden day-hover",
        "hover:bg-secondary/50",
        inCurrentMonth
          ? "bg-calendar-day"
          : "bg-calendar-day-outside text-muted-foreground",
        isToday && "bg-calendar-day-current"
      )}
    >
      <DayHeader day={day} isToday={isToday} isMobile={isMobile} />
      <EventList
        events={dayEvents}
        isLoading={isLoading}
        calendarSize={calendarSize}
      />
    </div>
  );
};

const DayHeader = ({
  day,
  isToday,
  isMobile,
}: {
  day: Date;
  isToday: boolean;
  isMobile: boolean;
}) => (
  <div className="flex justify-between items-start mb-1">
    <span
      className={cn(
        "text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full",
        isToday && "bg-primary text-primary-foreground"
      )}
    >
      {format(day, "d")}
    </span>
    {isToday && !isMobile && (
      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-1.5 rounded-full">
        Today
      </span>
    )}
  </div>
);

const EventList = ({
  events,
  isLoading,
  calendarSize,
}: {
  events: CalendarEvent[];
  isLoading: boolean;
  calendarSize: "small" | "medium" | "large";
}) => (
  <div className="space-y-1 overflow-y-auto max-h-[calc(100%-20px)] scrollbar-hide">
    {isLoading ? (
      <LoadingSkeletons calendarSize={calendarSize} />
    ) : (
      <EventItems events={events} calendarSize={calendarSize} />
    )}
  </div>
);

const LoadingSkeletons = ({
  calendarSize,
}: {
  calendarSize: "small" | "medium" | "large";
}) => (
  <>
    {Array(3)
      .fill(null)
      .map((_, index) => (
        <Skeleton
          key={index}
          className={
            calendarSize === "small"
              ? "h-4 w-full rounded-full"
              : "h-7 w-full rounded-md"
          }
        />
      ))}
  </>
);

const EventItems = ({
  events,
  calendarSize,
}: {
  events: CalendarEvent[];
  calendarSize: "small" | "medium" | "large";
}) => (
  <>
    {events.map((event) => (
      <EventItemRenderer
        key={event.id}
        event={event}
        calendarSize={calendarSize}
      />
    ))}
  </>
);

const EventItemRenderer = ({
  event,
  calendarSize,
}: {
  event: CalendarEvent;
  calendarSize: "small" | "medium" | "large";
}) =>
  calendarSize === "small" ? (
    <div className="rounded-full overflow-hidden inline-flex items-center justify-center mr-1">
      <img
        src={event.logo_url || undefined}
        alt={event.name}
        className="h-6 w-6 rounded-full"
      />
    </div>
  ) : (
    <EventItem event={event} />
  );

export default CalendarDay;
