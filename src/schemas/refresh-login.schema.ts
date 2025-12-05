import z from "zod";

export const refreshLoginSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RefreshLoginInput = z.infer<typeof refreshLoginSchema>;
