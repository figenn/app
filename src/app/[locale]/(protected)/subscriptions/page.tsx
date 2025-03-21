import { cookies } from "next/headers";
import CalendarWidget from "@/components/calendar/calendarWidget";
import WidgetRow from "@/components/widgets/widget-row";

export default async function Page() {
  const token = (await cookies()).get("token")?.value;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between gap-6 mx-10">
        <WidgetRow bearer={token} />
        <WidgetRow bearer={token} />
        <WidgetRow bearer={token} />
      </div>
      <div className="w-[95%] mx-10">
        <CalendarWidget bearer={token} />
      </div>
    </div>
  );
}
