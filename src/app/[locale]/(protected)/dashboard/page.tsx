import CalendarWidget from "@/components/calendar/calendarWidget";
import { cookies } from "next/headers";

export default async function Home() {
  const token = (await cookies()).get("token")?.value;

  return (
    <div>
      <p>This is the dashboard page. You can see the calendar widget below.</p>
    </div>
  );
}
