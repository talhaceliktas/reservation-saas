import * as z from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "invalid_email" }),
  password: z.string().min(6, { message: "min_password" }),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, { message: "required" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
