import z from "zod";

export const loginSchema = z.object({
  authToken: z.string("AUTH_TOKEN_MISSING"),
});

export type LoginInput = z.infer<typeof loginSchema>;
