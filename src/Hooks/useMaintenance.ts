import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

/* ================= TYPES ================= */
export interface MaintenanceRequestDto {
  roomId: number;
  issue: string;
  status?: string;
}

/* ================= HOOK ================= */
const useMaintenance = () => {
  const qc = useQueryClient();

  const maintenanceRequestsQuery = useQuery({
    queryKey: ["maintenance"],
    queryFn: async () =>
      (await api.get(Urls.MAINTENANCE.GET_ALL)).data as MaintenanceRequestDto[],
  });

  const createRequestMutation = useMutation({
    mutationFn: async (dto: MaintenanceRequestDto) =>
      (await api.post(Urls.MAINTENANCE.CREATE, dto)).data,
    onSuccess: () => {
      toast.success("Maintenance request created");
      qc.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) =>
      (await api.put(Urls.MAINTENANCE.UPDATE_STATUS(id), status)).data,
    onSuccess: () => {
      toast.success("Maintenance status updated");
      qc.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });

  return {
    maintenanceRequestsQuery,
    createRequestMutation,
    updateStatusMutation,
  };
};

export default useMaintenance;
