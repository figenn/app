"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "./ui/separator";
import { LoginFormData, loginSchema } from "@/schemas/Auth";
import { login } from "@/actions/auth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ForgotPasswordForm } from "./forgot-password";
import Loader from "./ui/loader";

export default function LoginForm() {
  const router = useRouter();
  const t = useTranslations("login");
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      const response = await login(data);

      if (!response.success) {
        setServerError(response.message ?? "An unknown error occurred.");
        return;
      }

      toast.success(t("success"));
      router.push("/dashboard");
    });
  };

  const formControlProps = (
    field: ControllerRenderProps<LoginFormData, keyof LoginFormData>,
    placeholder: string,
    type: string
  ) => ({
    ...field,
    placeholder,
    type,
    autoCapitalize: "none",
    autoComplete: type === "password" ? "current-password" : "email",
    autoCorrect: "off",
    disabled: isPending,
  });

  return (
    <div className="grid gap-3">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {t("description")}
        </p>
      </div>

      {serverError && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-2">
          {serverError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    {...formControlProps(field, "exemple@email.com", "email")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{t("password")}</FormLabel>
                  <ForgotPasswordForm />
                </div>
                <FormControl>
                  <Input {...formControlProps(field, "••••••••", "password")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader />}
            {t("submit")}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("orContinueWith")}
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" className="w-full">
        {t("google")}
      </Button>
    </div>
  );
}
