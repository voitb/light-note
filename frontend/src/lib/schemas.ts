import { z } from "zod"

export const noteSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }).max(100),
  content: z.string().min(1, { message: "Content is required" }),
  tags: z.array(z.string()).default([]),
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional().default(() => new Date()),
})

export type Note = z.infer<typeof noteSchema>

export const noteFormSchema = noteSchema.omit({ id: true, createdAt: true, updatedAt: true })

export type NoteFormValues = z.infer<typeof noteFormSchema>

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type RegisterFormValues = z.infer<typeof registerSchema> 