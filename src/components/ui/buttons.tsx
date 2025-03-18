"use client";

import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return <button onClick={handleLogout}>Logout</button>;
};
