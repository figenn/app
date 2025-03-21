"use client";

import * as React from "react";
import { Calendar, Home, Pi } from "lucide-react";

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
import { User } from "@/interfaces/User";

const data = {
  team: {
    name: "Figenn",
    logo: Pi,
    url: "/",
    plan: "Premium Plan",
  },
  navMain: [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: Home,
      isActive: false,
    },
    {
      title: "Abonnements",
      url: "/subscriptions",
      icon: Calendar,
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
        <TeamSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
