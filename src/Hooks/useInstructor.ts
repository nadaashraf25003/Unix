import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

/* =======================
   Types
======================= */
export interface InstructorDto {
  id: number;
  fullName: string;
  email: string;
  departmentId: number;
  departmentName?: string; // اختياري لعرض اسم القسم
}

export interface CreateInstructorDto {
  fullName: string;
  email: string;
  departmentId: number;
}

export interface UpdateInstructorDto {
  fullName?: string;
  email?: string;
  departmentId?: number;
}

/* =======================
   Hook
======================= */
const useInstructors = () => {
  const queryClient = useQueryClient();

  // 🔹 جلب كل المحاضرين
  const instructorsQuery = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      const res = await api.get(Urls.INSTRUCTORS.GET_ALL);
      return res.data as InstructorDto[];
    },
  });

  // 🔹 إنشاء محاضر جديد
  const createInstructorMutation = useMutation({
    mutationFn: async (data: CreateInstructorDto) => {
      const res = await api.post(Urls.INSTRUCTORS.GET_ALL, data); // افترض endpoint POST هو نفسه GET_ALL
      return res.data as InstructorDto;
    },
    onSuccess: (data) => {
      toast.success("تم إضافة المحاضر بنجاح");
      queryClient.setQueryData<InstructorDto[]>(["instructors"], (old = []) => [...old, data]);
    },
    onError: () => toast.error("فشل إضافة المحاضر"),
  });

  // 🔹 تحديث محاضر
  const updateInstructorMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateInstructorDto }) => {
      const res = await api.put(Urls.INSTRUCTORS.GET_BY_ID(id), data);
      return res.data as InstructorDto;
    },
    onSuccess: (updatedInstructor) => {
      toast.success("تم تعديل بيانات المحاضر");
      queryClient.setQueryData<InstructorDto[]>(["instructors"], (old = []) =>
        old.map((ins) => (ins.id === updatedInstructor.id ? updatedInstructor : ins))
      );
    },
    onError: () => toast.error("فشل تعديل بيانات المحاضر"),
  });

  // 🔹 حذف محاضر
  const deleteInstructorMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(Urls.INSTRUCTORS.GET_BY_ID(id));
      return res.data;
    },
    onSuccess: (_, id) => {
      toast.success("تم حذف المحاضر");
      queryClient.setQueryData<InstructorDto[]>(["instructors"], (old = []) =>
        old.filter((ins) => ins.id !== id)
      );
    },
    onError: () => toast.error("فشل حذف المحاضر"),
  });

  return {
    instructorsQuery,
    createInstructorMutation,
    updateInstructorMutation,
    deleteInstructorMutation,
  };
};

export default useInstructors;
