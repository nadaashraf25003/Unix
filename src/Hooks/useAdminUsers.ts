import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string | null;
  isActive: boolean;
  departmentId: number;
  stage: number;
  sectionId: number;
  isEmailVerified: boolean;
  createdAt: string;
}

const useAdminUsers = () => {
  const queryClient = useQueryClient();

  /* ===== GET ALL USERS ===== */
  const usersQuery = useQuery<UserDto[], Error>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get<UserDto[]>(Urls.USERS.GET_ALL);
      return res.data;
    },
  });

  /* ===== GET USER BY ID ===== */
  const getUserById = async (id: number): Promise<UserDto> => {
    const res = await api.get<UserDto>(Urls.USERS.GET_BY_ID(id));
    return res.data;
  };

  /* ===== DELETE USER ===== */
const deleteUserMutation = useMutation<void, Error, number>({
  mutationFn: async (id) => await api.delete(Urls.USERS.DELETE(id)),
  onSuccess: () => {
    toast.success("User deleted successfully");
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  },
});

  return {
    usersQuery,
    getUserById,
    deleteUserMutation,
  };
};

export default useAdminUsers;
