import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import ModeToggle from "./ui/toggle-theme";
import { User } from "@/interfaces/User";

export async function SiteHeader({ user }: { user: User }) {
  const t = await getTranslations("common");
  return (
    <header className="flex h-12 items-center border-b p-2 mr-6">
      <div className="flex w-full items-center px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-10" />
        <h1 className="text-base font-medium">
          {t("hello")} {user.first_name}&nbsp;{user.last_name}
        </h1>
      </div>
      <div>
        <ModeToggle />
      </div>
    </header>
  );
}
