
export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  category: string;
  color: string;
  description: string;
  start_date: string;
  end_date: string | null;
  price: number;
  logo_url: string;
  is_active: boolean;
  billing_cycle: "monthly" | "quarterly" | "yearly"
}

export interface CalendarEvent extends Subscription {
  displayDate: Date;
}