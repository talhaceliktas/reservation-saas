import { z } from "zod";

export const createServiceSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, {
      message: t("validation.nameMin"),
    }),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, {
      message: t("validation.durationMin"),
    }),
    price: z.coerce.number().min(0, {
      message: t("validation.priceMin"),
    }),
    currency: z
      .string()
      .min(1, {
        message: t("validation.currencyRequired"),
      })
      .default("USD"),
  });

export type ServiceFormValues = z.infer<ReturnType<typeof createServiceSchema>>;
