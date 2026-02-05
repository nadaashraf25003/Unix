import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain letters")
      .regex(/\d/, "Password must contain numbers"),});

  

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters"),

    email: z.string().email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain letters")
      .regex(/\d/, "Password must contain numbers"),

    confirmPassword: z.string(),

    role: z.enum(["Student", "Admin"]),

    departmentId: z.number().optional(),
    sectionId: z.number().optional(),
  })
  // تطابق الباسورد
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  // department مطلوب لو Student
  .refine(
    (data) => (data.role === "Student" ? !!data.departmentId : true),
    {
      message: "Department is required for students",
      path: ["departmentId"],
    }
  )
  // section مطلوب لو Student
  .refine(
    (data) => (data.role === "Student" ? !!data.sectionId : true),
    {
      message: "Section is required for students",
      path: ["sectionId"],
    }
  );



export const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Code must be 6 digits"),
});

export const forgotSchema = z.object({
  email: z.string().email(),
});

export const resetSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(6),
});