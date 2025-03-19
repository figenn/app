import { auth } from "@/actions/auth";
import SubscriptionCalendar from "@/components/calendar/subscriptionCalendar";
import ModeToggle from "@/components/ui/toggle-theme";
import { User } from "@/interface/user";
import { cookies } from "next/headers";

export default async function Home() {
  const user = (await auth()) as User;
  const token = (await cookies()).get("token")?.value;

  return (
    <nav className="p-4 bg-primary-foreground text-primary">
      <ModeToggle />
      <SubscriptionCalendar bearer={token} />
    </nav>
  );
}
