import { auth } from "@/actions/auth";
import { Suspense } from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();
  return (
    <Suspense fallback={"loading"}>
      <section>{children}</section>
    </Suspense>
  );
}
