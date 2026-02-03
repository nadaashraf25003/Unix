import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

/* ======================= TYPES ======================= */
export interface BuildingDto {
  id: number;
  name: string;
  description: string;
}

export interface CreateBuildingDto {
  name: string;
  description: string;
}

/* ======================= HOOK ======================= */
const useBuildings = () => {
  const queryClient = useQueryClient();

  // 1️⃣ جلب كل المباني
  const buildingsQuery = useQuery({
    queryKey: ["buildings"],
    queryFn: async () => {
      const res = await api.get(Urls.BUILDINGS.GET_ALL);
      return res.data as BuildingDto[];
    },
  });

  // 2️⃣ إنشاء مبنى جديد
  const createBuildingMutation = useMutation({
    mutationFn: async (data: CreateBuildingDto) =>
      (await api.post(Urls.BUILDINGS.CREATE, data)).data,
    onSuccess: () => {
      toast.success("تم إضافة المبنى بنجاح");
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
    onError: () => {
      toast.error("فشل إضافة المبنى");
    },
  });

  return {
    buildingsQuery,
    createBuildingMutation,
  };
};

export default useBuildings;
