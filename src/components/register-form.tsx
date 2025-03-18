'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StartConfetti } from "@/lib/confetti";
import { RegisterFormData, registerSchema } from "@/schemas/auth";
import { registerUser } from "@/actions/auth";
import { CountryDropdown } from "./ui/country-dropdown"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCountry, setSelectedCountry] = useState<string>("USA");
  
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      const response = await registerUser({ 
        ...data, 
        country: selectedCountry
      });

      if (!response.success) {
        setError("root.serverError", {
          type: "server",
          message: response.message,
        });
        return;
      }

      StartConfetti();

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register a new account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to register to your new account
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
          <Label htmlFor="first_name">First Name</Label>
          <Input 
          id="first_name" 
          type="text" 
          {...register("first_name")} 
          placeholder="John" 
          className={`${errors.first_name ? "border-red-500" : "border-gray-300"}`}
          required />
          {errors.first_name && (
            <p className="text-red-500 text-sm">{errors.first_name.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="last_Name">Last Name</Label>
          <Input 
          id="last_Name" 
          type="text" 
          {...register("last_name")} 
          placeholder="Doe" 
          className={`${errors.last_name ? "border-red-500" : "border-gray-300"}`}
          required />
          {errors.last_name && (
            <p className="text-red-500 text-sm">{errors.last_name.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="country">Country</Label>
          <CountryDropdown
            placeholder="Select a country"
            defaultValue={selectedCountry}
            onChange={(value) => {
              setSelectedCountry(value.alpha3);
              setValue("country", value.alpha3);
            }}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" {...register("password")} type="password" required 
          className={` ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}/>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="passwordConfirm">Confirm Password</Label>
          <Input 
          id="passwordConfirm" 
          type="password" 
          {...register("passwordConfirm")} 
          className={`${errors.passwordConfirm ? "border-red-500" : "border-gray-300"}`}
          required />
          {errors.passwordConfirm && (
            <p className="text-red-500 text-sm">{errors.passwordConfirm.message}</p>
          )}
        </div>
        {isPending ? (
          <p>Loading...</p>
        ) : (
          <Button type="submit" className="w-full">
            Register
          </Button>
        )}
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/auth/login" className="underline underline-offset-4">
          Log In
        </a>
      </div>
    </form>
  )
}
