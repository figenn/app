import { AuthForm } from "@/components/form/form-auth";
import { IconDarkMode } from "@/components/ui/iconButtons";
import { GalleryVerticalEnd } from "lucide-react";

export default function LoginPage() {
  return (
    <section className="flex flex-col min-h-screen">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <IconDarkMode />
        <div className="flex justify-center gap-2 md:justify-end">
          <div className="bg-primary text-primary-foreground flex items-center justify-center rounded-md size-6">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Figenn.
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center -mt-20">
        <AuthForm formType="login" />
      </div>
    </section>
  );
}
