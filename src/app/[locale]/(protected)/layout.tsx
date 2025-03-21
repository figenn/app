import { Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { auth } from "@/actions/auth";
import Spinner from "@/components/ui/loader";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <Suspense fallback={<Spinner />}>
      <SidebarProvider>
        <AppSidebar variant="inset" user={user} />
        <SidebarInset>
          <SiteHeader user={user} />
          <main className="mt-5">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
