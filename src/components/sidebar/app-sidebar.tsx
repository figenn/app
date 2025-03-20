"use client";

import * as React from "react";
import { Pi, WalletCards } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
<<<<<<< HEAD
import { User } from "@/interface/user";

const data = {
=======

// This is sample data.
const defaultData = {
>>>>>>> 00c448f (update)
  team: {
    name: "Figenn",
    logo: Pi,
    url: "/",
    plan: "Premium Plan",
  },
  navMain: [
    {
      title: "Abonnements",
      url: "#",
      icon: WalletCards,
      isActive: true,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={defaultData.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={defaultData.navMain} />
      </SidebarContent>
<<<<<<< HEAD
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
=======
      <SidebarFooter>{user ? <NavUser user={user} /> : null}</SidebarFooter>
>>>>>>> 00c448f (update)
      <SidebarRail />
    </Sidebar>
  );
}
