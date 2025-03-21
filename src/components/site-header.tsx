import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import ModeToggle from "./ui/toggle-theme";
import { User } from "@/interfaces/User";
import { Bell, PlusCircle, PlusCircleIcon } from "lucide-react";

export async function SiteHeader({ user }: { user: User }) {
  const t = await getTranslations("common");
  return (
    <header className="flex h-14 items-center border-b mr-6">
      <div className="flex w-full items-center px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-10" />
        <h1 className="text-base font-medium">
          {t("hello")} {user.first_name}&nbsp;{user.last_name}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="size-7" />
        <ModeToggle />
        <PlusCircleIcon className="size-7 text-orange-400" />
      </div>
    </header>
  );
}
