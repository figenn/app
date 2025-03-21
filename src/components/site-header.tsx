import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import { User } from "@/interfaces/User";
import { Bell, PlusCircleIcon } from "lucide-react";
import { IconButton, IconDarkMode } from "@/components/ui/iconButtons";

export async function SiteHeader({ user }: { user: User }) {
  const t = await getTranslations("common");
  return (
    <header className="flex h-14 items-center border-b">
      <div className="flex-1 flex items-center px-4">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="mx-3 h-8" />
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {t("hello")} {user.first_name}&nbsp;{user.last_name}
        </h1>
      </div>
      <nav className="flex items-center gap-3 mr-4">
        <IconButton ariaLabel="Notifications">
          <Bell />
        </IconButton>
        <IconDarkMode toggleTheme={true} />
        <IconButton ariaLabel="Add new item">
          <PlusCircleIcon />
        </IconButton>
      </nav>
    </header>
  );
}
