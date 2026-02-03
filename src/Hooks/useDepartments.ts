import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

/* =======================
   Types
======================= */

export interface DepartmentDto {
  id: number;
  name: string;
  code: string;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
}

/* =======================
   Hook
======================= */

const useDepartments = () => {
  const queryClient = useQueryClient();

  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await api.get(Urls.DEPARTMENTS.GET_ALL);
      return res.data as DepartmentDto[];
    },
  });

 const createDepartmentMutation = useMutation({
  mutationFn: async (data: CreateDepartmentDto) => {
    try {
      const res = await api.post(Urls.DEPARTMENTS.CREATE, data);
      return res.data;
    } catch (err: any) {
      console.error("API Error:", err.response?.data || err.message);
      throw err; // مهم عشان يظهر في mutateAsync catch
    }
  },
  onSuccess: () => {
    toast.success("تم إنشاء القسم بنجاح");
    queryClient.invalidateQueries({ queryKey: ["departments"] });
  },
  onError: (err: any) => {
    toast.error("فشل إضافة القسم: " + (err.response?.data?.message || err.message));
  },
});


const updateDepartmentMutation = useMutation({
  mutationFn: async ({ id, data }: { id: number; data: CreateDepartmentDto }) =>
    (await api.put(Urls.DEPARTMENTS.UPDATE(id), data)).data, // صح ✅
  onSuccess: () => {
    toast.success("تم تعديل القسم");
    queryClient.invalidateQueries({ queryKey: ["departments"] });
  },
  onError: (err: any) => {
    console.error("Update Department Error:", err.response?.data || err.message);
    toast.error("فشل تعديل القسم: " + (err.response?.data?.message || err.message));
  },
});



const deleteDepartmentMutation = useMutation({
  mutationFn: async (id: number) =>
    (await api.delete(Urls.DEPARTMENTS.DELETE(id))).data, // صح ✅
  onSuccess: () => {
    toast.success("تم حذف القسم");
    queryClient.invalidateQueries({ queryKey: ["departments"] });
  },
  onError: (err: any) => {
    console.error("Delete Department Error:", err.response?.data || err.message);
    toast.error("فشل حذف القسم: " + (err.response?.data?.message || err.message));
  },
});


  return {
    departmentsQuery,
    createDepartmentMutation,
    updateDepartmentMutation,
    deleteDepartmentMutation,
  };
};

export default useDepartments;
