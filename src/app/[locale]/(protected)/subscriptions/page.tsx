import { cookies } from "next/headers";
import CalendarWidget from "@/components/calendar/calendarWidget";
import WidgetRow from "@/components/widgets/widget-row";

export default async function Page() {
  const token = (await cookies()).get("token")?.value;

  return (
    <div>
      <WidgetRow bearer={token} />
      <div className="w-[80vw]">
        <CalendarWidget bearer={token} />
      </div>
    </div>
  );
}
