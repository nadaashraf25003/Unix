/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

/* =======================
   Types
======================= */

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/* =======================
   Hook
======================= */

const useNotifications = () => {
  const queryClient = useQueryClient();

  // Get user notifications
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get<Notification[]>(Urls.NOTIFICATIONS.GET_ALL);
      return res.data;
    },
  });

  // Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.put(`${Urls.NOTIFICATIONS.MARK_READ}/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notificationsQuery,
    markAsReadMutation,
  };
};

export default useNotifications;
