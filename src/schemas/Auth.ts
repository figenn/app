import { z } from "zod";

type TranslationFunction = (key: string) => string;

const emailValidation = /^(?!.*\+\d+)[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordValidation = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const loginSchema = (t: TranslationFunction) =>
  z.object({
    email: z.string().email({ message: t("errors.emailInvalid") }),
    password: z.string().min(8, { message: t("errors.passwordMinLength") }),
  });

export const registerSchema = (t: TranslationFunction) =>
  z.object({
    first_name: z
      .string({ required_error: t("errors.firstNameRequired") })
      .min(1, t("errors.firstNameRequired"))
      .max(32, t("errors.firstNameMaxLength")),

    last_name: z
      .string({ required_error: t("errors.lastNameRequired") })
      .min(1, t("errors.lastNameRequired"))
      .max(32, t("errors.lastNameMaxLength")),

    email: z
      .string({ required_error: t("errors.emailRequired") })
      .min(1, t("errors.emailRequired"))
      .email(t("errors.emailValid"))
      .regex(emailValidation, t("errors.emailNoPlus")),

    country: z
      .string({ required_error: t("errors.countryRequired") })
      .min(1, t("errors.countryRequired"))
      .max(32, t("errors.countryMaxLength")),

    password: z
      .string({ required_error: t("errors.passwordRequired") })
      .min(1, t("errors.passwordRequired"))
      .min(8, t("errors.passwordMinLength"))
      .max(32, t("errors.passwordMaxLength"))
      .regex(passwordValidation, t("errors.passwordRegex")),

    passwordConfirm: z
      .string({ required_error: t("errors.confirmPasswordRequired") })
      .min(1, t("errors.confirmPasswordRequired")),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: t("errors.confirmPasswordMatch"),
  });

export const forgotPasswordSchema = (t: TranslationFunction) =>
  z.object({
    email: z
      .string({ required_error: t("errors.emailRequired") })
      .min(1, t("errors.emailRequired"))
      .email(t("errors.emailValid")),
  });

export const resetPasswordSchema = (t: TranslationFunction) =>
  z.object({
    password: z
      .string({ required_error: t("errors.passwordRequired") })
      .min(1, t("errors.passwordRequired"))
      .min(8, t("errors.passwordMinLength"))
      .max(32, t("errors.passwordMaxLength"))
      .regex(passwordValidation, t("errors.passwordRegex")),

    passwordConfirm: z
      .string({ required_error: t("errors.confirmPasswordRequired") })
      .min(1, t("errors.confirmPasswordRequired")),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: t("errors.confirmPasswordMatch"),
  });

export type LoginFormData = z.infer<ReturnType<typeof loginSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof registerSchema>>;
export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>;
export type ResetPasswordFormData = z.infer<
  ReturnType<typeof resetPasswordSchema>
>;