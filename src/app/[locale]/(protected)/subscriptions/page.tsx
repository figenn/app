import CalendarWidget from "@/components/subscriptions/calendar/calendarWidget";
import SubscriptionCalculator from "@/components/subscriptions/subscriptionCalculator/widgetSubCalculator";
import WidgetRow from "@/components/subscriptions/widgets/widget-row";
import { cookies } from "next/headers";

export default async function Page() {
  const token = (await cookies()).get("token")?.value;

  return (
    <div className="space-y-6">
      <WidgetRow bearer={token} />
      <div className="w-full flex flex-col gap-6 p-4">
        <CalendarWidget bearer={token} />
        <SubscriptionCalculator bearer={token} />
      </div>
    </div>
  );
}
