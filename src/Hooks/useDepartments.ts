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
    mutationFn: async (data: CreateDepartmentDto) =>
      (await api.post(Urls.DEPARTMENTS.CREATE, data)).data,
    onSuccess: () => {
      toast.success("Department created");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CreateDepartmentDto;
    }) => (await api.put(`${Urls.DEPARTMENTS.UPDATE}/${id}`, data)).data,
    onSuccess: () => {
      toast.success("Department updated");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: number) =>
      (await api.delete(`${Urls.DEPARTMENTS.DELETE}/${id}`)).data,
    onSuccess: () => {
      toast.success("Department deleted");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
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
