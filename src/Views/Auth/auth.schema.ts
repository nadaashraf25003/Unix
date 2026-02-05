import { z } from "zod";

/* ======================
   Login
====================== */
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain letters")
    .regex(/\d/, "Password must contain numbers"),
});

/* ======================
   Register
====================== */
export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),

    email: z.string().email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),

    role: z.enum(["Student", "Admin"]),

    // 👇 مهم جدًا مع select
    departmentId: z.coerce.number().optional(),
    sectionId: z.coerce.number().optional(),
  })
  // تطابق الباسورد
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  // department مطلوب لو Student
  .refine(
    (data) => (data.role === "Student" ? !!data.departmentId : true),
    {
      path: ["departmentId"],
      message: "Department is required",
    }
  )
  // section مطلوب لو Student
  .refine(
    (data) => (data.role === "Student" ? !!data.sectionId : true),
    {
      path: ["sectionId"],
      message: "Section is required",
    }
  );

/* ======================
   Other schemas
====================== */
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
