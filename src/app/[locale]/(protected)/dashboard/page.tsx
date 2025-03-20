import ModeToggle from "@/components/ui/toggle-theme";
import { cookies } from "next/headers";
import CalendarWidget from "@/components/calendar/calendarWidget";
import LogoutButton from "@/components/ui/buttons";

export default async function Home() {
  const token = (await cookies()).get("token")?.value;
  return (
    <div>
      <ModeToggle />
      <LogoutButton />
      <CalendarWidget bearer={token} />
    </div>
  );
}
