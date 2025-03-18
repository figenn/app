import { auth } from "@/actions/auth";
import ModeToggle from "@/components/ui/toggle-theme";
import { User } from "@/interface/user";

export default async function Home() {
  const user = (await auth()) as User;
  return (
    <nav className="p-4 bg-primary-foreground text-primary">
      <ModeToggle />
      <h1 className="text-xl">Mon App</h1>
    </nav>
  );
}
