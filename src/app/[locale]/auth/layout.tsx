import LiquidChrome from "@/components/ui/liquid-chrome";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={"loading"}>
      <section>
        <div className="grid min-h-svh lg:grid-cols-2">
          <div className="bg-muted relative hidden lg:block">
            <LiquidChrome
              baseColor={[0.1, 0.1, 0.1]}
              speed={0.1}
              amplitude={0.6}
              interactive={true}
            />
          </div>
          {children}
        </div>
      </section>
    </Suspense>
  );
}
