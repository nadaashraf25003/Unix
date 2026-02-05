import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./auth.schema";
import { z } from "zod";
import useAuth from "@/Hooks/useAuth";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/Routing/routePaths";

import useDepartments, { DepartmentDto } from "@/Hooks/useDepartments";
import useSections, { SectionDto } from "@/Hooks/useSections";

/* ======================
   TYPES
====================== */
// 👇 دي أهم سطر في الموضوع كله
export type RegisterForm = z.input<typeof registerSchema>;

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: "Student" | "Admin";
  departmentId: number;
  sectionId: number;
  stage: number;
};

const Register = () => {
  const navigate = useNavigate();
  const { registerMutation } = useAuth();
  const { departmentsQuery } = useDepartments();
  const { sectionsQuery } = useSections();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Student",
      departmentId: undefined,
      sectionId: undefined,
    },
  });

  const selectedRole = watch("role");
  const selectedDepartmentId = watch("departmentId");

  const onSubmit = (data: RegisterForm) => {
    const selectedSection = sectionsQuery.data?.find(
      (sec) => sec.id === Number(data.sectionId)
    );

    const payload: RegisterData = {
      name: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
      departmentId: data.role === "Student" ? Number(data.departmentId) : 0,
      sectionId:
        data.role === "Student" && data.sectionId
          ? Number(data.sectionId)
          : 0,
      stage:
        data.role === "Student" && selectedSection
          ? selectedSection.stage
          : 0,
    };

    registerMutation.mutate(payload, {
      onSuccess: () => navigate(ROUTES.VERIFY_EMAIL),
      onError: (err: any) =>
        toast.error(err.response?.data?.message || "Registration failed"),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto"
    >
      {/* Full Name */}
      <div>
        <label className="block mb-2">Full Name</label>
        <input {...register("fullName")} className="input w-full" />
        {errors.fullName && (
          <p className="text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block mb-2">Email</label>
        <input {...register("email")} className="input w-full" />
        {errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block mb-2">Password</label>
        <input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          className="input w-full"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block mb-2">Confirm Password</label>
        <input
          {...register("confirmPassword")}
          type={showConfirm ? "text" : "password"}
          className="input w-full"
        />
        {errors.confirmPassword && (
          <p className="text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Role */}
      <div>
        <label className="block mb-2">Role</label>
        <select {...register("role")} className="input w-full">
          <option value="Student">Student</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* Department */}
      {selectedRole === "Student" && (
        <div>
          <label className="block mb-2">Department</label>
          <select {...register("departmentId")} className="input w-full">
            <option value="">Select Department</option>
            {departmentsQuery.data?.map((d: DepartmentDto) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="text-red-500">{errors.departmentId.message}</p>
          )}
        </div>
      )}

      {/* Section */}
      {selectedRole === "Student" && selectedDepartmentId && (
        <div>
          <label className="block mb-2">Section</label>
          <select {...register("sectionId")} className="input w-full">
            <option value="">Select Section</option>
            {sectionsQuery.data
              ?.filter(
                (s: SectionDto) =>
                  s.departmentId === Number(selectedDepartmentId)
              )
              .map((s: SectionDto) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Stage {s.stage})
                </option>
              ))}
          </select>
          {errors.sectionId && (
            <p className="text-red-500">{errors.sectionId.message}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="btn-primary w-full"
      >
        {registerMutation.isPending ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
};

export default Register;
