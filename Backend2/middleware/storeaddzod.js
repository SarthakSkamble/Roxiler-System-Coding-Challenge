import {z} from "zod"



export const Schema3 = z.object({
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

  
});


