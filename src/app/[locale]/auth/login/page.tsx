import LoginForm from "@/components/login-form";
import { Icons } from "@/components/spinner";
import ModeToggle from "@/components/ui/toggle-theme";
import { GalleryVerticalEnd } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-between items-center">
        <ModeToggle />
        <div className="flex justify-center gap-2 md:justify-end">
          <div className="bg-primary text-primary-foreground flex items-center justify-center rounded-md size-6">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Figenn.
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full min-w-[20rem] max-w-[23rem]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
