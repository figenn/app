import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "errors.emailInvalid" }),
  password: z.string().min(8, { message: "errors.passwordMinLength" }),
});

const emailValidation = /^(?!.*\+\d+)[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordValidation = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const registerSchema = z.object({
  first_name: z.string({ required_error: "errors.firstNameRequired" })
    .min(1, "errors.firstNameRequired")
    .max(32, "errors.firstNameMaxLength"),
  
  last_name: z.string({ required_error: "errors.lastNameRequired" })
    .min(1, "errors.lastNameRequired")
    .max(32, "errors.lastNameMaxLength"),

  email: z.string({ required_error: "errors.emailRequired" })
    .min(1, "errors.emailRequired")
    .email("errors.emailValid")
    .regex(emailValidation, "errors.emailNoPlus"),

    country: z.string({ required_error: "errors.countryRequired" })
    .min(1, "errors.countryRequired")
    .max(32, "errors.countryMaxLength"),

  password: z.string({ required_error: "errors.passwordRequired" })
    .min(1, "errors.passwordRequired")
    .min(8, "errors.passwordMinLength")
    .max(32, "errors.passwordMaxLength")
    .regex(passwordValidation, "errors.passwordRegex"),

  passwordConfirm: z.string({ required_error: "errors.confirmPasswordRequired" })
    .min(1, "errors.confirmPasswordRequired"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "errors.confirmPasswordMatch",
});

export const forgotPasswordSchema = z.object({
  email: z.string({ required_error: "errors.emailRequired" })
    .min(1, "errors.emailRequired")
    .email("errors.emailValid"),
});

export const resetPasswordSchema = z.object({
  password: z.string({ required_error: "errors.passwordRequired" })
    .min(1, "errors.passwordRequired")
    .min(8, "errors.passwordMinLength")
    .max(32, "errors.passwordMaxLength")
    .regex(passwordValidation, "errors.passwordRegex"),

  passwordConfirm: z.string({ required_error: "errors.confirmPasswordRequired" })
    .min(1, "errors.confirmPasswordRequired"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "errors.confirmPasswordMatch",
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;