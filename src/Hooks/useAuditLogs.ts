import { useQuery } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

/* ================= TYPES ================= */
export interface AuditLogDto {
  id: number;
  userName: string;
  action: string;
  createdAt: string;
}

/* ================= HOOK ================= */
const useAuditLogs = () => {
  const auditLogsQuery = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () =>
      (await api.get(Urls.AUDIT_LOGS.GET_ALL)).data as AuditLogDto[],
  });

  return { auditLogsQuery };
};

export default useAuditLogs;
