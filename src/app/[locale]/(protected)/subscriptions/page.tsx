import CalendarWidget from "@/components/subscriptions/calendar/calendarWidget";
import SubscriptionCalculator from "@/components/subscriptions/subscriptionCalculator/widgetSubCalculator";

import WidgetRow from "@/components/widgets/widget-row";
import { cookies } from "next/headers";

export default async function Page() {
  const token = (await cookies()).get("token")?.value;

  return (
    <div className="flex flex-col gap-10 container mx-auto px-4">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <WidgetRow bearer={token} />
        <WidgetRow bearer={token} />
      </div>
      <div className="w-full">
        <SubscriptionCalculator bearer={token} />
        <CalendarWidget bearer={token} />
      </div>
    </div>
  );
}
