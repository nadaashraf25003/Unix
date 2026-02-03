/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

/* =======================
   Types
======================= */

export interface Announcement {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  createdById: number;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
}

/* =======================
   Hook
======================= */

const useAnnouncements = () => {
  const queryClient = useQueryClient();

  // Get all announcements
  const announcementsQuery = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await api.get<Announcement[]>(Urls.ANNOUNCEMENTS.GET_ALL);
      return res.data;
    },
  });

  // Create announcement (Admin)
  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: CreateAnnouncementData) => {
      const res = await api.post(Urls.ANNOUNCEMENTS.CREATE, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Announcement created");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });

  return {
    announcementsQuery,
    createAnnouncementMutation,
  };
};

export default useAnnouncements;
