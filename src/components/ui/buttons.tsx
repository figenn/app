import { logout } from "@/actions/auth";
import { redirect } from "next/navigation";

async function logoutAction() {
  "use server";
  await logout();
  redirect("/auth/login");
}

export default async function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit">Logout</button>
    </form>
  );
}
