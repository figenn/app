import { CalendarDay, Subscription } from "@/interface/subscription";

export const generateCalendarDays = (
  year: number,
  month: number,
  subscriptions: Subscription[]
): CalendarDay[] => {
  const days: CalendarDay[] = [];
  
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  const today = new Date();
  
  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  
  const dayOfWeek = (date: Date) => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };
  
  const firstDayIndex = dayOfWeek(firstDayOfMonth);
  
  if (firstDayIndex > 0) {
    const prevMonth = new Date(year, month - 2, 1);
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
    
    for (let i = 0; i < firstDayIndex; i++) {
      const day = daysInPrevMonth - firstDayIndex + i + 1;
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
      
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        subscriptions: getSubscriptionsForDate(date, subscriptions)
      });
    }
  }
  
  const daysInMonth = lastDayOfMonth.getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month - 1, i);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      subscriptions: getSubscriptionsForDate(date, subscriptions)
    });
  }
  
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
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
    if (sub.billing_date && sub.billing_date.includes('-')) {
      const billingDate = new Date(sub.billing_date);
      return billingDate.getDate() === day;
    } else if (sub.start_date) {
      const parts = sub.start_date.split('-');
      if (parts.length >= 3) {
        const billingDay = parseInt(parts[2]);
        return billingDay === day;
      }
    }
    return false;
  });
};