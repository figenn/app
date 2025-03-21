import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTransition } from "react";
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/schemas/Auth";
import { forgotPassword } from "@/actions/auth";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    startTransition(async () => {
      const response = await forgotPassword(data);

      if (!response.success) {
        setError("root.serverError", {
          type: "server",
          message: response.message,
        });
        return;
      }

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <a className="ml-auto text-sm underline-offset-4 hover:underline">
          Forgot your password?
        </a>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Insert your email to receive a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                {...register("email")}
                className={`${errors.email ? "border-red-500" : ""}`}
                required
              />
            </div>
            {isPending ? (
              <p>Loading</p>
            ) : (
              <Button
                type="submit"
                size="sm"
                className="px-3"
                disabled={isPending}
              >
                <span className="sr-only">Send</span>
                <Send />
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
