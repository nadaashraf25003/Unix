import React from "react";
import { useForm } from "react-hook-form";
import useInstructors, { InstructorDto, CreateInstructorDto } from "@/Hooks/useInstructor";
import useDepartments, { DepartmentDto } from "@/Hooks/useDepartments";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

const InstructorManager: React.FC = () => {
  const { instructorsQuery } = useInstructors();
  const { departmentsQuery } = useDepartments();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<CreateInstructorDto>({
    defaultValues: {
      fullName: "",
      email: "",
      departmentId: 0,
    },
  });

  // Mutation لإضافة محاضر جديد في الباك
  const createInstructorMutation = useMutation({
    mutationFn: async (data: CreateInstructorDto) => {
      const res = await api.post(Urls.INSTRUCTORS.GET_ALL, data); // POST على نفس endpoint
      return res.data as InstructorDto;
    },
    onSuccess: (newInstructor) => {
      toast.success("تم إضافة المحاضر بنجاح");
      queryClient.invalidateQueries({ queryKey: ["instructors"] }); // إعادة جلب المحاضرين
      reset();
    },
    onError: (err: any) => {
      toast.error("فشل إضافة المحاضر: " + (err.response?.data?.message || err.message));
    },
  });

  const onSubmit = (data: CreateInstructorDto) => {
    createInstructorMutation.mutate(data);
  };

  return (
    <div className="p-6 bg-light dark:bg-dark min-h-screen" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-light">
        إدارة المحاضرين
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 max-w-xl mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
          <PlusCircle className="w-5 h-5 text-primary dark:text-dark-primary" />
          إضافة محاضر جديد
        </h2>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">الاسم الكامل</label>
          <input {...register("fullName", { required: true })} className="input" />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
          <input type="email" {...register("email", { required: true })} className="input" />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">القسم</label>
          <select {...register("departmentId", { required: true })} className="input">
            <option value={0}>اختر القسم</option>
            {departmentsQuery.data?.map((dep: DepartmentDto) => (
              <option key={dep.id} value={dep.id}>
                {dep.name} ({dep.code})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary w-full">
          إضافة محاضر
        </button>
      </form>

      <div className="card p-4 max-w-xl">
        <h2 className="text-lg font-bold mb-4">قائمة المحاضرين</h2>
        <ul className="space-y-2">
          {(instructorsQuery.data || []).map((ins) => (
            <li
              key={ins.id}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center"
            >
              <span>
                {ins.fullName} ({ins.email}) - القسم:{" "}
                {departmentsQuery.data?.find(dep => dep.id === ins.departmentId)?.name || ins.departmentId}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InstructorManager;
