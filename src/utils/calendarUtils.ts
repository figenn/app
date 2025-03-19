import { CalendarDay, Subscription } from "@/interface/subscription";


export const generateCalendarDays = (
  year: number,
  month: number,
  subscriptions: Subscription[]
): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const today = new Date();
  const isToday = (date: Date) => 
    date.getDate() === today.getDate() && 
    date.getMonth() === today.getMonth() && 
    date.getFullYear() === today.getFullYear();
  
  const daysFromPrevMonth = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
  for (let i = daysFromPrevMonth; i > 0; i--) {
    const date = new Date(year, month - 2, lastDayOfMonth.getDate() - i + 1);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      subscriptions: getSubscriptionsForDate(date, subscriptions)
    });
  }
  
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month - 1, i);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      subscriptions: getSubscriptionsForDate(date, subscriptions)
    });
  }
    const daysToAdd = 42 - days.length;
  for (let i = 1; i <= daysToAdd; i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      subscriptions: getSubscriptionsForDate(date, subscriptions)
    });
  }
  
  return days;
};

const getSubscriptionsForDate = (date: Date, subscriptions: Subscription[] | null): Subscription[] => {
    if (!subscriptions) {
      return [];
    }
    
    const day = date.getDate();
    
    return subscriptions.filter(sub => {
      if (sub.billing_date.includes('-')) {
        const billingDate = new Date(sub.start_date);
        return billingDate.getDate() === day;
      } else {
        const billingDay = parseInt(sub.start_date.split('-')[2]);
        return billingDay === day;
      }
    });
};