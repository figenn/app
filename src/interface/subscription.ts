export type Subscription = {
    id: string
    user_id: string
    name: string
    category: string
    color: string
    description: string
    start_date: string
    end_date: string | null
    price: number
    logo_url: string
    is_active: boolean
    billing_cycle: string
    billing_date: string
    created_at: string
    updated_at: string
  }
  
  export type CalendarDay = {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    subscriptions: Subscription[];
  };