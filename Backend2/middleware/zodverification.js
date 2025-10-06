import {z} from "zod"

// Regex for password: at least one uppercase letter, at least one special character, 8-16 chars
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

export const Schema = z.object({
  name: z
    .string()
    .min(20, { message: "Name must be at least 20 characters long" })
    .max(60, { message: "Name must be at most 60 characters long" }),

  address: z
    .string()
    .max(400, { message: "Address must be at most 400 characters long" }),

  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .regex(passwordRegex, { 
      message: "Password must be 8-16 chars, include at least one uppercase letter and one special character"
    }),
});


