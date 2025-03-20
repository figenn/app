import { cookies } from "next/headers";
import CalendarWidget from "@/components/calendar/calendarWidget";

export default async function Home() {
  const token = (await cookies()).get("token")?.value;
  return <CalendarWidget bearer={token} />;
}
