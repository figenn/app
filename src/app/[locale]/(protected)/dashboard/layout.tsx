import { Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { auth } from "@/actions/auth";
import Spinner from "@/components/ui/loader";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();
  console.log(user);

  return (
    <Suspense fallback={"loading"}>
      <section className="">
        <SidebarProvider>
          <AppSidebar variant="inset" user={user} />
          <SidebarInset>
            <SiteHeader user={user} />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </section>
    </Suspense>
  );
}
