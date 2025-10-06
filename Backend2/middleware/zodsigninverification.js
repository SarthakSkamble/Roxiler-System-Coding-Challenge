import {z} from "zod"

// Regex for password: at least one uppercase letter, at least one special character, 8-16 chars
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

export const Schema2 = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .regex(passwordRegex, { 
      message: "Password must be 8-16 chars, include at least one uppercase letter and one special character"
    }),
});


