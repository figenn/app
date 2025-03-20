import { CalendarEvent, Subscription } from "@/interfaces/Subscription";

export type CalendarSize = "small" | "medium";

export interface CalendarProps {
  subscriptions: Subscription[];
  className?: string;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  isLoading?: boolean;
  size?: CalendarSize;
}

export interface CalendarDayProps {
  day: Date;
  currentMonth: Date;
  today: Date;
  events: CalendarEvent[];
  isLoading?: boolean;
  calendarSize?: CalendarSize;
}

export interface CalendarHeaderProps {
  currentMonth: Date;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  locale: string;
}

export interface EventItemProps {
  event: CalendarEvent;
}

export interface EventDetailsPopoverProps {
  event: Subscription;
  children: React.ReactNode;
} 