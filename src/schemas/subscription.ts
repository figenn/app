import { z } from "zod"


export const formSubscriptionSchema = z.object({
    name: z.string().min(2, {
      message: "Le nom doit contenir au moins 2 caractères.",
    }),
    category: z.string().optional(),
    color: z.string().regex(/^#([0-9A-F]{6})$/i, {
      message: "Veuillez entrer une couleur hexadécimale valide (ex: #FF5733).",
    }),
    description: z.string().optional(),
    start_date: z.string({
      required_error: "Veuillez sélectionner une date de début.",
    }),
    price: z.coerce.number().positive({
      message: "Le prix doit être un nombre positif.",
    }),
    billing_cycle: z.enum(["monthly", "quarterly", "annual"], {
      required_error: "Veuillez sélectionner un cycle de facturation.",
    }),
    logo_url: z.string().optional(),
  });
  
 export type SubscriptionFormValues = z.infer<typeof formSubscriptionSchema>;