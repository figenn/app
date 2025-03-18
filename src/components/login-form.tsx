'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/schemas/auth";
import { login } from "@/actions/auth";
import { ForgotPasswordForm } from "./forgot-password"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const {
      register,
      handleSubmit,
      setError,
      formState: { errors },
    } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
    });
  
    const onSubmit = (data: LoginFormData) => {
      startTransition(async () => {
        const response = await login(data);
  
        if (!response.success) {
          setError("root.serverError", {
            type: "server",
            message: response.message,
          });
          return;
        }
  
        router.push("/dashboard");
      });
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      {errors.root?.serverError && (
        <div className="text-red-500">{errors.root.serverError.message}</div>
      )}
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
          id="email" 
          type="email" 
          {...register("email")} 
          placeholder="m@example.com" 
          className={`${errors.email ? "border-red-500" : "border-gray-300"}`}
          required />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <ForgotPasswordForm />
          </div>
          <Input id="password" {...register("password")} type="password" required 
          className={` ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}/>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        {isPending ? (
          <p>Loading...</p>
        ) : (
          <Button type="submit" className="w-full">
            Login
          </Button>
        )}
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/auth/register" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
