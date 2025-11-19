import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, { message: "required" }).email({ message: "email" }),
  password: z
    .string()
    .min(1, { message: "required" })
    .min(8, { message: "minPassword" }),
});

export const registerSchema = z.object({
  fullName: z.string().min(1, { message: "required" }),
  email: z.string().min(1, { message: "required" }).email({ message: "email" }),
  password: z
    .string()
    .min(1, { message: "required" })
    .min(8, { message: "minPassword" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
