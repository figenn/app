"use client";

import { useMemo, useState, useTransition } from "react";
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
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { Separator } from "../ui/separator";
import Spinner from "../ui/loader";
import { StartConfetti } from "@/lib/confetti";
import { registerUser, login } from "@/actions/auth";
import { CountryDropdown } from "../ui/country-dropdown";
import {
  loginSchema,
  registerSchema,
  LoginFormData,
  RegisterFormData,
} from "@/schemas/Auth";
import { ForgotPasswordForm } from "../auth/forgot-password";
import React from "react";

type FormType = "login" | "register";

interface AuthFormProps {
  formType: FormType;
}

export function AuthForm({ formType }: AuthFormProps) {
  const router = useRouter();
  const t = useTranslations(formType);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLogin = formType === "login";
  const isRegister = formType === "register";

  const useAuthSchema = () => {
    const locale = useLocale();
    return useMemo(() => {
      if (isLogin) {
        return loginSchema(t);
      } else {
        return registerSchema(t);
      }
    }, [locale, t]);
  };

  const form = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(useAuthSchema()),
    defaultValues: isLogin
      ? { email: "", password: "" }
      : {
          email: "",
          first_name: "",
          last_name: "",
          country: "FRA",
          password: "",
          passwordConfirm: "",
        },
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData | RegisterFormData) => {
    setServerError(null);

    startTransition(async () => {
      try {
        let response;
        if (isLogin) {
          response = await login(data as LoginFormData);
          if (!response.success) {
            setServerError(response.message ?? t("error.unknown"));
            return;
          }
          toast.success(t("success"));
          router.push("/dashboard");
        } else {
          response = await registerUser(data as RegisterFormData);
          if (!response.success) {
            setServerError(response.message ?? t("error.unknown"));
            return;
          }
          StartConfetti();
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        }
      } catch {
        setServerError(t("error.unexpected"));
      }
    });
  };

  const formControlProps = (
    field: ControllerRenderProps<
      LoginFormData | RegisterFormData,
      keyof (LoginFormData | RegisterFormData)
    >,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    {...formControlProps(field, t("emailPlaceholder"), "email")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isRegister && (
            <div>
              <div className="flex gap-4">
                {" "}
                {/* Use flexbox for first and last name on the same line */}
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      {" "}
                      {/* Make each field take equal space */}
                      <FormLabel>{t("firstName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("firstNamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      {" "}
                      {/* Make each field take equal space */}
                      <FormLabel>{t("lastName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("lastNamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="w-full mt-4">
                    {" "}
                    {/* Full width and margin top */}
                    <FormLabel>{t("country")}</FormLabel>
                    <FormControl>
                      <CountryDropdown
                        placeholder={t("countryPlaceholder")}
                        defaultValue={field.value}
                        onChange={(value) => {
                          field.onChange(value.alpha3);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{t("password")}</FormLabel>
                  {isLogin && <ForgotPasswordForm />}
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("passwordPlaceholder")}
                      {...field}
                      className="pl-9"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isRegister && (
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("passwordConfirm")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("passwordConfirmPlaceholder")}
                        {...field}
                        className="pl-9"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Spinner />}
            {t("submit")}
          </Button>
        </form>
      </Form>

      {isLogin && (
        <>
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
            <svg
              width="256"
              height="262"
              viewBox="0 0 256 262"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>

            {t("google")}
          </Button>
        </>
      )}
    </div>
  );
}
