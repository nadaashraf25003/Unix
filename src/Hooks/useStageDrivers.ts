/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

/* =======================
   Types
======================= */

export interface StageDriver {
  id: number;
  title: string;
  type: string;
  link: string;
  stage: number;
  departmentName?: string;
}

export interface CreateStageDriverData {
  title: string;
  type: string;
  link: string;
  stage: number;
  departmentId: number;
}

/* =======================
   Hook
======================= */

const useStageDrivers = () => {
  const queryClient = useQueryClient();

  // Student materials
 const studentMaterialsQuery = useQuery({
  queryKey: ["stage-drivers", "student"],
  queryFn: async () => {
    try {
      const res = await api.get<StageDriver[]>(Urls.STAGE_DRIVERS.STUDENT);
      return res.data;
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  },
});


  // Create
  const createStageDriverMutation = useMutation({
    mutationFn: async (data: CreateStageDriverData) => {
      const res = await api.post(Urls.STAGE_DRIVERS.CREATE, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Material added");
      queryClient.invalidateQueries({ queryKey: ["stage-drivers"] });
    },
  });

  // Update
const updateStageDriverMutation = useMutation({
  mutationFn: async ({
    id,
    data,
  }: {
    id: number;
    data: CreateStageDriverData;
  }) => {
    const res = await api.put(
      Urls.STAGE_DRIVERS.UPDATE(id), // ✅ الاستدعاء الصحيح
      data
    );
    return res.data;
  },
  onSuccess: () => {
    toast.success("Material updated");
    queryClient.invalidateQueries({ queryKey: ["stage-drivers"] });
  },
  onError: (error: any) => {
    console.error("Update error:", error?.response?.data || error);
    toast.error("فشل تحديث المادة");
  },
});


  // Delete
const deleteStageDriverMutation = useMutation({
  mutationFn: async (id: number) => {
    const res = await api.delete(Urls.STAGE_DRIVERS.DELETE(id));
    return res.data;
  },
  onSuccess: () => {
    toast.success("Material deleted");
    queryClient.invalidateQueries({ queryKey: ["stage-drivers"] });
  },
});


  return {
    studentMaterialsQuery,
    createStageDriverMutation,
    updateStageDriverMutation,
    deleteStageDriverMutation,
  };
};

export default useStageDrivers;
