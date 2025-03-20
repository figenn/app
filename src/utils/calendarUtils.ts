import { CalendarEvent, Subscription } from "@/interfaces/Subscription";
import { 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  startOfWeek,
  endOfWeek
} from "date-fns";

export const getDaysInMonth = (date: Date) => {
  const firstDayOfMonth = startOfMonth(date);
  const lastDayOfMonth = endOfMonth(date);
  
  return eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth
  });
};

export const getCalendarDays = (date: Date) => {
  const firstDayOfMonth = startOfMonth(date);
  const lastDayOfMonth = endOfMonth(date);
  const firstDayOfWeek = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
  const lastDayOfWeek = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });
  
  const allDays = eachDayOfInterval({
    start: firstDayOfWeek,
    end: lastDayOfWeek
  });
  
  return allDays;
};

export const getNextMonth = (date: Date): Date => {
  return addMonths(date, 1);
};

export const getPrevMonth = (date: Date): Date => {
  return subMonths(date, 1);
};

export const formatMonthYear = (date: Date, locale: string = 'fr'): string => {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const getSubscriptionOccurrencesInMonth = (subscription: Subscription, month: Date): CalendarEvent[] => {
    const startDate = new Date(subscription.start_date);
    const dayOfMonth = startDate.getUTCDate();
    const currentMonth = month.getUTCMonth();
    const currentYear = month.getUTCFullYear();
    const daysInCurrentMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0)).getUTCDate();
    const eventDayOfMonth = Math.min(dayOfMonth, daysInCurrentMonth);

    const eventDate = new Date(Date.UTC(currentYear, currentMonth, eventDayOfMonth));

    if (eventDate >= startDate) {
        return [{
            ...subscription,
            displayDate: eventDate
        }];
    }

    return [];
};

export const getEventsForDay = (events: CalendarEvent[], day: Date): CalendarEvent[] => {
  return events.filter(event => isSameDay(event.displayDate, day));
};