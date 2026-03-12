import z from "zod";

const registerSchema = z.object({
  username: z
    .string("Username is required")
    .min(6, "Username must be at least 6 characters"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["OWNER"], {
    error: "Role must be one of the following: OWNER",
  }),
});

const loginSchema = z.object({
  username: z
    .string("Username is required")
    .min(6, "Username must be at least 6 characters"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string("Refresh token is required"),
});

export { registerSchema, loginSchema, refreshTokenSchema };
