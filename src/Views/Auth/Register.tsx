import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./auth.schema";
import { z } from "zod";
import useAuth from "@/Hooks/useAuth";
import useDepartments from "@/Hooks/useDepartments";
import useSections from "@/Hooks/useSections";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/Routing/routePaths";

export type RegisterForm = z.infer<typeof registerSchema>;

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
    formState: { errors },
    watch,
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
  const selectedDepartment = watch("departmentId");

  const onSubmit = (data: RegisterForm) => {
    const payload = {
      name: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
      departmentId: data.departmentId || 0,
      sectionId: data.sectionId || 0,
      stage: 1,
    };

    registerMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Account created! Please verify your email.");
        navigate(ROUTES.VERIFY_EMAIL);
      },
      onError: (err: any) =>
        toast.error(err.response?.data?.message || "Registration failed"),
    });
  };

  const departments = departmentsQuery.data || [];
  const sections = sectionsQuery.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Name
        </label>
        <input
          {...register("fullName")}
          className="input w-full"
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address
        </label>
        <input
          {...register("email")}
          type="email"
          className="input w-full"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            className="input w-full pr-10"
            placeholder="Create a strong password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            className="input w-full pr-10"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Role
        </label>
        <select {...register("role")} className="input w-full">
          <option value="Student">Student</option>
          <option value="Admin">Admin</option>
        </select>
        {errors.role && (
          <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Department */}
      {selectedRole === "Student" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Department
          </label>
          <select {...register("departmentId")} className="input w-full">
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="text-sm text-red-500 mt-1">{errors.departmentId.message}</p>
          )}
        </div>
      )}

      {/* Section */}
      {selectedRole === "Student" && selectedDepartment && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Section
          </label>
          <select {...register("sectionId")} className="input w-full">
            <option value="">Select Section</option>
            {sections
              .filter((s) => s.departmentId === Number(selectedDepartment))
              .map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
          </select>
          {errors.sectionId && (
            <p className="text-sm text-red-500 mt-1">{errors.sectionId.message}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="btn-primary w-full py-3"
      >
        {registerMutation.isPending ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default Register;
