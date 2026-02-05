/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

/* =======================
   Types
======================= */

export interface LostAndFoundItem {
  id: number;
  itemName: string;
  itemType: string;
  location: string;
  date: string;
  contactInfo: string;
  isResolved: boolean;
}

export interface CreateLostAndFoundData {
  itemName: string;
  itemType: string;
  location: string;
  date: string;
  contactInfo: string;
}

/* =======================
   Hook
======================= */

const useLostAndFound = () => {
  const queryClient = useQueryClient();

  // Get all items
  const lostAndFoundQuery = useQuery({
    queryKey: ["lost-found"],
    queryFn: async () => {
      const res = await api.get<LostAndFoundItem[]>(Urls.LOST_FOUND.GET_ALL);
      return res.data;
    },
  });

  // Create item
  const createLostItemMutation = useMutation({
    mutationFn: async (data: CreateLostAndFoundData) => {
      const res = await api.post(Urls.LOST_FOUND.CREATE, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Item reported successfully");
      queryClient.invalidateQueries({ queryKey: ["lost-found"] });
    },
  });

  // Resolve item (Admin)
const resolveItemMutation = useMutation({
  mutationFn: async (id: number) => {
    const res = await api.put(Urls.LOST_FOUND.RESOLVE(id));
    return res.data;
  },
  onSuccess: () => {
    toast.success("Item marked as resolved");
    queryClient.invalidateQueries({ queryKey: ["lost-found"] });
  },
});


  // Delete item (Admin)
 const deleteItemMutation = useMutation({
  mutationFn: async (id: number) => {
    const res = await api.delete(Urls.LOST_FOUND.DELETE(id));
    return res.data;
  },
  onSuccess: () => {
    toast.success("Item deleted");
    queryClient.invalidateQueries({ queryKey: ["lost-found"] });
  },
});


  return {
    lostAndFoundQuery,
    createLostItemMutation,
    resolveItemMutation,
    deleteItemMutation,
  };
};

export default useLostAndFound;
